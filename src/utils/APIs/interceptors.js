import axios from "axios";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";

export const requestInterceptor = (config) => {
  const token = localStorage.getItem('access_token');
  
  if (!config.headers.Authorization && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

export const requestErrorInterceptor = (error) => {
  return Promise.reject(error);
}

export const responseInterceptor = (response) => response;

export const responseErrorInterceptor = (error) => {
  if (error.code === 'ECONNREFUSED') {
    console.error('❌ Cannot connect to backend at', API_BASE_URL);
    return Promise.reject(error);
  }
  // Only log errors that are representative of actual issues (exclude 401, 403, 404 to avoid noise from auth issues or missing endpoints)
  
  const status = error.response?.status;
  const data = error.response?.data;
  const path = window.location.pathname;
  if (![401, 403, 404].includes(status)) {
    logErrorToBackend(error);
  }
  const isAuthRoute =
    path.startsWith('/login') ||
    path.startsWith('/signup') ||
    path.startsWith('/auth') ||
    path === '/';

  // Only hard-logout if NOT already on auth pages
  if (status === 401 && !isAuthRoute) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    console.warn('🔐 Unauthorized — redirecting to login');
    window.location.href = '/login';
    return Promise.reject(error);
  }

  // Auth pages should receive the error normally
  if (data) {
    console.error('API Error:', status, data);
    return Promise.reject(data);
  }

  if (error.response) {
    console.error('API Error:', status, error.response.data);
  }

  return Promise.reject(error);
};

const logErrorToBackend = (error) => {
  try {
    console.log("Logging error to backend:", {
      errorFromBackend: error.response?.data?.error,
      errorMessage: error.message,
      stack: error.stack,
      page: window.location.pathname,
      component: error.component || "Unknown Component",
    });
    axios.post(`${API_BASE_URL}/log-client-error`, {
      errorFromBackend: error?.response?.data?.error || error?.error || false,
      errorMessage: error.message,
      stack: error.stack,
      page: window.location.pathname,
      component: error.component || "Unknown Component",
    });
  } catch (logError) {
    console.error('Failed to log error to backend:', logError);
  }
}