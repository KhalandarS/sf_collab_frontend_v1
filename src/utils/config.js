export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").trim();
export const API_URL_AUTH = (import.meta.env.VITE_API_URL_AUTH || "http://localhost:5001/api/auth").trim();
export const API_BASE_URL_NO_API = API_URL.replace("/api", "");
export const SOCKET_API_URL = (import.meta.env.VITE_SOCKET_API_URL || API_BASE_URL_NO_API).trim();
export const STRIPE_PUBLIC_KEY = (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "").trim();
export const API_BASE_URL = API_URL;
export const getApiUrl = () => API_URL;
export const getSocketUrl = () => SOCKET_API_URL;