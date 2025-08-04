import React, { createContext, FC, useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import genericRepository from "../repositories/genericRepository";
import { LoginResponseDto } from "../types/LoginResponseDto";
import { LoginRequestDto } from "../types/LoginRequestDto";
import { TokenDTO } from "../types/TokenDTO";

// Constants for security
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER_DATA: 'userData',
} as const;

const TOKEN_REFRESH_THRESHOLD = 5 * 60; // 5 minutes before expiry
const MAX_RETRY_ATTEMPTS = 3;

type Role = "Admin" | "User" | "guest";

interface UserData {
  username: string;
  email: string;
  role: Role;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  userRole: Role | null;
  username: string | null;
  email: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
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
    const payload = TokenUtils.decodeJWT(token);
    if (!payload || !payload.exp) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  },

  // Check if token needs refresh (within threshold)
  needsRefresh: (token: string): boolean => {
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
      return {
        username: `${payload.FirstName || ''} ${payload.LastName || ''}`.trim(),
        email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/Name"] || '',
        role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/Role"] || 'guest'
      };
    } catch (error) {
      console.error('Failed to extract user data:', error);
      return null;
    }
  }
};

// Secure storage utilities
const SecureStorage = {
  // Store access token (short-lived)
  setAccessToken: (token: string): void => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    } catch (error) {
      console.error('Failed to store access token:', error);
    }
  },

  // Get access token
  getAccessToken: (): string | null => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
      return null;
    }
  },

  // Store user data (encrypted if possible)
  setUserData: (userData: UserData): void => {
    try {
      const encryptedData = btoa(JSON.stringify(userData)); // Basic encoding
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
      sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
};

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const navigate = useNavigate();
  const loginRepository = genericRepository<LoginResponseDto, LoginRequestDto>("accounts/login");
  const refreshRepository = genericRepository<LoginResponseDto, TokenDTO>("accounts/refreshToken");
  const logoutRepository = genericRepository<any, any>("accounts/logout");

  // Update user state from token
  const updateUserState = useCallback((token: string) => {
    const userData = TokenUtils.extractUserData(token);
    if (userData) {
      setIsAuthenticated(true);
      setUsername(userData.username);
      setEmail(userData.email);
      setUserRole(userData.role);
      SecureStorage.setUserData(userData);
    }
  }, []);

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

      const response = await loginRepository.post(requestData);
      const loginResponse = response.response as unknown as LoginResponseDto;

      if (!loginResponse?.token) {
        throw new Error('Invalid response: missing token');
      }

      // Validate token before storing
      if (!TokenUtils.isTokenValid(loginResponse.token)) {
        throw new Error('Received invalid or expired token');
      }

      // Store access token securely (refresh token handled by httpOnly cookies)
      SecureStorage.setAccessToken(loginResponse.token);
      updateUserState(loginResponse.token);

      // Navigate based on role
      const userData = TokenUtils.extractUserData(loginResponse.token);
      if (userData?.role === "Admin") {
        navigate("/home");
      } else {
        navigate("/");
      }

      setRetryCount(0); // Reset retry count on successful login
      return true;

    } catch (error) {
      console.error("Login error:", error);
      // Clear any partial state
      SecureStorage.clearAll();
      setIsAuthenticated(false);
      setUserRole(null);
      setUsername(null);
      setEmail(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loginRepository, navigate, updateUserState]);

  // Secure token refresh function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      console.error('Max retry attempts reached for token refresh');
      return false;
    }

    try {
      setRetryCount(prev => prev + 1);
      
      // Use httpOnly cookies for refresh token
      const response = await fetch('/api/accounts/refreshToken', {
        method: 'POST',
        credentials: 'include', // Include httpOnly cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const refreshResponse: LoginResponseDto = await response.json();
      
      if (!refreshResponse?.token || !TokenUtils.isTokenValid(refreshResponse.token)) {
        throw new Error('Invalid refresh response');
      }

      SecureStorage.setAccessToken(refreshResponse.token);
      updateUserState(refreshResponse.token);
      setRetryCount(0); // Reset on success
      return true;

    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, [retryCount, updateUserState]);

  // Secure logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Call logout API with httpOnly cookies
      await fetch('/api/accounts/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.warn("Logout API call failed:", error);
    }

    // Clear all local state and storage
    SecureStorage.clearAll();
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername(null);
    setEmail(null);
    setRetryCount(0);
    navigate("/");
  }, [navigate]);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = SecureStorage.getAccessToken();
      const userData = SecureStorage.getUserData();

      if (token && TokenUtils.isTokenValid(token)) {
        // Token is valid, update state
        if (userData) {
          setIsAuthenticated(true);
          setUsername(userData.username);
          setEmail(userData.email);
          setUserRole(userData.role);
        } else {
          updateUserState(token);
        }

        // Check if token needs refresh
        if (TokenUtils.needsRefresh(token)) {
          await refreshToken();
        }
      } else if (token) {
        // Token exists but is invalid/expired, try to refresh
        const refreshSuccess = await refreshToken();
        if (!refreshSuccess) {
          // Refresh failed, clear everything
          SecureStorage.clearAll();
          setIsAuthenticated(false);
          setUserRole(null);
          setUsername(null);
          setEmail(null);
        }
      } else {
        // No token, set guest state
        setIsAuthenticated(false);
        setUserRole(null);
        setUsername(null);
        setEmail(null);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, [refreshToken, updateUserState]);

  // Auto token refresh
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      const token = SecureStorage.getAccessToken();
      if (token && TokenUtils.needsRefresh(token)) {
        const success = await refreshToken();
        if (!success) {
          await logout();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshToken, logout]);

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      userRole,
      username,
      email,
      isLoading,
      login,
      logout,
    }),
    [isAuthenticated, userRole, username, email, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};