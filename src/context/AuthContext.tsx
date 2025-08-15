import React, { createContext, FC, useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import genericRepository from "../repositories/genericRepository";
import { LoginResponseDto } from "../types/LoginResponseDto";
import { LoginRequestDto } from "../types/LoginRequestDto";
import { TokenDTO } from "../types/TokenDTO";

// Constants for security
const STORAGE_KEYS = {
  TOKEN_DATA: 'jwtToken',
  USER_DATA: 'userData',
} as const;

const TOKEN_REFRESH_THRESHOLD = 5 * 60; // 5 minutes before expiry
const MAX_RETRY_ATTEMPTS = 3;
const REFRESH_CHECK_INTERVAL = 60000; // 1 minute

type Role = "Admin" | "User" | "guest";

interface UserData {
  username: string;
  Email: string;
  Role: Role;
  FirstName: string;
  LastName: string;
  Address: string;
  Photo: string;
  CityId: string;
  CountryCode:string;
  MobilePhone:string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  userRole: Role | null;
  username: string | null;
  email: string | null;
  photo: string | null;  
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  processAuthResponse: (loginResponse: LoginResponseDto) => void;  
}

// Utility functions for secure token handling
const TokenUtils = {
  // Safely decode JWT payload
  decodeJWT: (token: string): any | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = parts[1];
      // Add padding if necessary
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
      const decoded = atob(paddedPayload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  },

  // Check if token is valid and not expired
  isTokenValid: (token: string): boolean => {
    if (!token || typeof token !== 'string') return false;
    
    const payload = TokenUtils.decodeJWT(token);
    if (!payload || !payload.exp) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  },

  // Check if token needs refresh (within threshold)
  needsRefresh: (token: string): boolean => {
    if (!token || typeof token !== 'string') return true;
    
    const payload = TokenUtils.decodeJWT(token);
    if (!payload || !payload.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return (payload.exp - currentTime) < TOKEN_REFRESH_THRESHOLD;
  },

  // Extract user data from token
  extractUserData: (token: string): UserData | null => {
    const payload = TokenUtils.decodeJWT(token);
    if (!payload) return null;

    try {      
      let role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
                 payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/Role"] || 
                 payload.Role || 
                 payload.role;
                 
      if (role !== "User" && role !== "Admin") {
        role = "guest";
      }

      const email = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || 
                    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/Name"] || 
                    payload.email || 
                    payload.Email || 
                    '';

      return {
        username: `${payload.FirstName || payload.first_name || ''} ${payload.LastName || payload.last_name || ''}`.trim(),
        Email: email,
        Role: role as Role,
        FirstName: payload.FirstName || payload.first_name || '',
        LastName: payload.LastName || payload.last_name || '',
        Address: payload.Address || payload.Adress || payload.address || '',
        Photo: payload.Photo || payload.photo || '',
        CityId: payload.CityId || payload.cityId || payload.city_id || '',
        CountryCode:payload.CountryCode || payload.CountryCode || '',
        MobilePhone:payload.PhoneNumber || payload.PhoneNumber || '',
      };
    } catch (error) {
      console.error('Failed to extract user data:', error);
      return null;
    }
  }
};

// Secure storage utilities
const SecureStorage = {
  // Store complete token data
  setTokenData: (tokenData: TokenDTO): void => {
    try {
      const encryptedData = btoa(JSON.stringify(tokenData));
      localStorage.setItem(STORAGE_KEYS.TOKEN_DATA, encryptedData);
    } catch (error) {
      console.error('Failed to store token data:', error);
    }
  },

  // Get complete token data
  getTokenData: (): TokenDTO | null => {
    try {
      const encryptedData = localStorage.getItem(STORAGE_KEYS.TOKEN_DATA);
      if (!encryptedData) return null;
      
      const decryptedData = atob(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Failed to retrieve token data:', error);
      return null;
    }
  },

  // Get access token only
  getAccessToken: (): string | null => {
    const tokenData = SecureStorage.getTokenData();
    return tokenData?.token || null;
  },

  // Get refresh token only
  getRefreshToken: (): string | null => {
    const tokenData = SecureStorage.getTokenData();
    return tokenData?.refreshToken || null;
  },

  // Store user data
  setUserData: (userData: UserData): void => {
    try {
      const encryptedData = btoa(JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.USER_DATA, encryptedData);
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  },

  // Get user data
  getUserData: (): UserData | null => {
    try {
      const encryptedData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!encryptedData) return null;
      
      const decryptedData = atob(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  },

  // Clear all stored data
  clearAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN_DATA);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
};

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  // State variables
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null); 

  const navigate = useNavigate();
  
  // Repository instances
  const loginRepository = genericRepository<LoginResponseDto, LoginRequestDto>("accounts/login");
  const refreshRepository = genericRepository<LoginResponseDto, { refreshToken: string }>("accounts/refreshToken");
  const logoutRepository = genericRepository<any, TokenDTO>("accounts/Logout");

  // Clear auth state helper
  const clearAuthState = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername(null);
    setEmail(null); 
    setRetryCount(0);
    SecureStorage.clearAll();
  }, []);

  // Update user state from token
  const updateUserState = useCallback((token: string) => {
    try {
      const userData = TokenUtils.extractUserData(token);
      if (userData) {
        console.log('Updating user state:', userData);
        setIsAuthenticated(true);
        setUsername(userData.username);
        setEmail(userData.Email);
        setUserRole(userData.Role);       
        setPhoto(userData.Photo); 
        SecureStorage.setUserData(userData);
        return true;
      } else {
        console.error('Failed to extract user data from token');
        clearAuthState();
        return false;
      }
    } catch (error) {
      console.error('Error updating user state:', error);
      clearAuthState();
      return false;
    }
  }, [clearAuthState]);

  // Secure login function
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    if (!username.trim() || !password.trim()) {
      console.error('Username and password are required');
      return false;
    }
    setIsLoading(true);    
    try {
      const requestData: LoginRequestDto = {
        email: username.trim(),
        password: password,
      };
      console.log('Attempting login...');
      const response = await loginRepository.post(requestData);
      const loginResponse = response.response as unknown as LoginResponseDto;

      if (!loginResponse?.token) {
        throw new Error('Invalid response: missing token');
      }

      // Validate token before storing
      if (!TokenUtils.isTokenValid(loginResponse.token)) {
        throw new Error('Received invalid or expired token');
      }

      // Create complete TokenDTO
      const tokenData: TokenDTO = {
        token: loginResponse.token,
        refreshToken: loginResponse.refreshToken || loginResponse.token,
        expiration: loginResponse.expiration || new Date(Date.now() + 3600000).toISOString(),
        refreshTokenExpiration: loginResponse.refreshTokenExpiration || new Date(Date.now() + 86400000).toISOString()
      };

      // Store token data and update state
      SecureStorage.setTokenData(tokenData);
      
      if (!updateUserState(loginResponse.token)) {
        throw new Error('Failed to process user data');
      }

      // Navigate based on role
      const userData = TokenUtils.extractUserData(loginResponse.token);
      if (userData?.Role === "Admin") {
        navigate("/home");
      } else {
        navigate("/");
      }

      setRetryCount(0);
      console.log('Login successful');
      return true;

    } catch (error) {
      console.error("Login error:", error);
      clearAuthState();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loginRepository, navigate, updateUserState, clearAuthState]);

  // Secure token refresh function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    // Prevent concurrent refresh attempts
    if (isRefreshing) {
      console.log('Refresh already in progress, skipping...');
      return false;
    }
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      console.error('Max retry attempts reached for token refresh');
      clearAuthState();
      return false;
    }
    // Check network connectivity
    if (!navigator.onLine) {
      console.warn('No internet connection, skipping token refresh');
      return false;
    }
    setIsRefreshing(true);
    setRetryCount(prev => prev + 1);
    try {
      const currentTokenData = SecureStorage.getTokenData();
      if (!currentTokenData?.refreshToken) {
        throw new Error('No refresh token found');
      }

      console.log('Attempting token refresh...');
      
      // Send only refresh token (standard API format)
      const refreshRequest = {
        refreshToken: currentTokenData.refreshToken
      };

      const response = await refreshRepository.post(refreshRequest);
      
      if (!response?.response) {
        throw new Error('Empty refresh response');
      }

      const refreshResponse = response.response as unknown as LoginResponseDto;
      
      // Validate response
      if (!refreshResponse?.token) {
        throw new Error('No token in refresh response');
      }

      if (!TokenUtils.isTokenValid(refreshResponse.token)) {
        throw new Error('Received invalid token from refresh');
      }

      // Create new token data
      const newTokenData: TokenDTO = {
        token: refreshResponse.token,
        refreshToken: refreshResponse.refreshToken || currentTokenData.refreshToken,
        expiration: refreshResponse.expiration || new Date(Date.now() + 3600000).toISOString(),
        refreshTokenExpiration: refreshResponse.refreshTokenExpiration || currentTokenData.refreshTokenExpiration
      };

      // Store new token and update state
      SecureStorage.setTokenData(newTokenData);
      
      if (!updateUserState(refreshResponse.token)) {
        throw new Error('Failed to update user state after refresh');
      }

      setRetryCount(0);
      console.log('Token refresh successful');
      return true;

    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // Clear auth data if we've exhausted retries
      if (retryCount >= MAX_RETRY_ATTEMPTS - 1) {
        console.log('Max retries reached, clearing auth data');
        clearAuthState();
      }
      
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [retryCount, isRefreshing, updateUserState, clearAuthState, refreshRepository]);

  // Secure logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      const tokenData = SecureStorage.getTokenData();
      
      if (tokenData?.token?.trim()) {
        try {
          //console.log('Calling logout API...');
          //await logoutRepository.post(tokenData);
        } catch (apiError) {
          console.warn("Logout API call failed:", apiError);
        }
      }
      
    } catch (error) {
      console.warn("Unexpected error during logout:", error);
    } finally {
      // Always clear auth data and navigate
      clearAuthState();
      navigate("/");
      console.log('Logout completed');
    }
  }, [navigate, logoutRepository, clearAuthState]);
  // update user info
  const processAuthResponse = useCallback((loginResponse: LoginResponseDto) => {
  if (!loginResponse?.token) {
    throw new Error('Invalid response: missing token');
  }

  // Validate token before storing
  if (!TokenUtils.isTokenValid(loginResponse.token)) {
    throw new Error('Received invalid or expired token');
  }

  // Create complete TokenDTO
  const tokenData: TokenDTO = {
    token: loginResponse.token,
    refreshToken: loginResponse.refreshToken || loginResponse.token,
    expiration: loginResponse.expiration || new Date(Date.now() + 3600000).toISOString(),
    refreshTokenExpiration: loginResponse.refreshTokenExpiration || new Date(Date.now() + 86400000).toISOString()
  };

  // Store token data
  SecureStorage.setTokenData(tokenData);

  // Update user state
  if (!updateUserState(loginResponse.token)) {
    throw new Error('Failed to process user data');
  }

  // Optionally: Navigate based on role
  const userData = TokenUtils.extractUserData(loginResponse.token);
  if (userData?.Role === "Admin") {
    navigate("/home");
  } else {
    navigate("/");
  }
}, [navigate, updateUserState]);
  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing auth state...');
      
      try {
        const tokenData = SecureStorage.getTokenData();
        const userData = SecureStorage.getUserData();

        if (tokenData?.token && TokenUtils.isTokenValid(tokenData.token)) {
          console.log('Valid token found, restoring session');
          
          // Use cached user data if available and valid
          if (userData) {
            setIsAuthenticated(true);
            setUsername(userData.username);
            setEmail(userData.Email);
            setUserRole(userData.Role);
            setPhoto(userData.Photo);           
          } else {
            // Extract user data from token
            updateUserState(tokenData.token);           
          }

          // Schedule refresh if needed (don't wait for it)
          if (TokenUtils.needsRefresh(tokenData.token)) {
            console.log('Token needs refresh, scheduling...');
            setTimeout(() => refreshToken(), 1000); // Delay to avoid blocking initialization
          }

        } else if (tokenData?.refreshToken) {
          console.log('Token expired but refresh token available, attempting refresh...');
          
          // Try to refresh once during initialization
          const refreshSuccess = await refreshToken();
          if (!refreshSuccess) {
            console.log('Initial refresh failed, clearing auth data');
            clearAuthState();
          }

        } else {
          console.log('No valid token data found, starting as guest');
          clearAuthState();
        }

      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []); // Empty dependency array to run only once

  // Auto token refresh interval
  useEffect(() => {
    if (!isAuthenticated) return;

    console.log('Setting up auto-refresh interval');
    
    const interval = setInterval(async () => {
      const token = SecureStorage.getAccessToken();
      
      if (token && TokenUtils.needsRefresh(token)) {
        console.log('Auto-refreshing token...');
        const success = await refreshToken();
        
        if (!success) {
          console.log('Auto-refresh failed, logging out...');
          await logout();
        }
      }
    }, REFRESH_CHECK_INTERVAL);

    return () => {
      console.log('Clearing auto-refresh interval');
      clearInterval(interval);
    };
  }, [isAuthenticated, logout, refreshToken]);

  // Handle network connectivity changes
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network connected, checking token status...');
      const token = SecureStorage.getAccessToken();
      if (token && TokenUtils.needsRefresh(token)) {
        refreshToken();
      }
    };

    const handleOffline = () => {
      console.log('Network disconnected');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshToken]);

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      userRole,
      username,
      email,
      photo,
      isLoading,     
      login,
      logout,
      processAuthResponse     
    }),
    [isAuthenticated, userRole, username, email, isLoading, login, logout,processAuthResponse ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};