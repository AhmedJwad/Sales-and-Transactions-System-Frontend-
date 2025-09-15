import axios from "axios";
import { HttpResponseWrapper } from "../repositories/httpResponseWrapper";

const baseURL = "https://localhost:7027/api/";

export const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
); */
axiosInstance.interceptors.request.use(
  (config) => {
    
    const getAccessToken = () => {
      try {
        const encryptedData = localStorage.getItem('jwtToken');
        if (!encryptedData) return null;
        
        const decryptedData = atob(encryptedData);
        const tokenData = JSON.parse(decryptedData);
        return tokenData?.token || null;
      } catch (error) {
        return null;
      }
    };

    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
/* axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("jwtToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
); */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
     const publicPaths = ["/", "/homeproducts", "/homeproducts/:subcategoryId"];
      const currentPath = window.location.pathname;
      if (!publicPaths.includes(currentPath)) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userData");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

const extractErrorMessage = (errorData: any): string => {
  if (!errorData) return "An unexpected error has occurred.";
  if (typeof errorData === "string") return errorData;
  if (typeof errorData.message === "string") return errorData.message;  
  return JSON.stringify(errorData);
};

const httpService = {
  get: async <T>(url: string, params: Record<string, any> | null = null): Promise<HttpResponseWrapper<T>> => {
    try {
      const response = await axiosInstance.get(url, { params });
      return {
        response: response.data,
        error: false,
        statusCode: response.status,
      };
    } catch (error: any) {
      return {
        response: null,
        error: true,
        statusCode: error.response?.status ?? 500,
        message: extractErrorMessage(error.response?.data),
      };
    }
  },

  post: async <T>(url: string, data: any): Promise<HttpResponseWrapper<T>> => {
    try {
      const response = await axiosInstance.post(url, data);
      return {
        response: response.data,
        error: false,
        statusCode: response.status,
      };
    } catch (error: any) {
      return {
        response: null,
        error: true,
        statusCode: error.response?.status ?? 500,
        message: extractErrorMessage(error.response?.data),
      };
    }
  },

  put: async <T>(url: string, data: any): Promise<HttpResponseWrapper<T>> => {
    try {
      const response = await axiosInstance.put(url, data);
      return {
        response: response.data,
        error: false,
        statusCode: response.status,
      };
    } catch (error: any) {
      return {
        response: null,
        error: true,
        statusCode: error.response?.status ?? 500,
        message: extractErrorMessage(error.response?.data),
      };
    }
  },

  delete: async <T>(url: string): Promise<HttpResponseWrapper<T>> => {
    try {
      const response = await axiosInstance.delete(url);
      return {
        response: response.data,
        error: false,
        statusCode: response.status,
      };
    } catch (error: any) {
      return {
        response: null,
        error: true,
        statusCode: error.response?.status ?? 500,
        message: extractErrorMessage(error.response?.data),
      };
    }
  },
};

export default httpService;
