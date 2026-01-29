import { API_BASE_URL, API_URL } from '@/utils/config';
import axios from 'axios';
import { responseErrorInterceptor, responseInterceptor } from './interceptors';

// 1. Create a centralized instance
const api = axios.create({
  baseURL: API_URL, // This is usually "http://localhost:5001/api"
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});


api.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);


export class authAPI {
  static async loginRequest(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Login failed:", error.response.data);
        return error.response.data;
      } else {
        console.error("Login error:", error.message);
        return error;
      }
    }
  }

  static async loginGoogleRequest(credentials) {
    try {
      const response = await api.post('/auth/google/login', credentials);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Google login failed:", error.response.data);
        return error.response.data;
      } else {
        console.error("Google login error:", error.message);
        return error;
      }
    }
  }

  static async registerRequest(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Registration failed:", error.response.data);
        return error.response.data;
      } else {
        console.error("Registration error:", error.message);
        return error;
      }
    }
  }

  static async refreshTokenRequest(refreshToken) {
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Token refresh failed:", error.response.data);
        return error.response.data;
      } else {
        console.error("Token refresh error:", error.message);
        return error;
      }
    }
  }

  static async getProfileRequest(token) {
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Get profile failed:", error.response.data);
        return error.response.data;
      } else {
        console.error("Get profile error:", error.message);
        return error;
      }
    }
  }

  static async logoutRequest() {
    try {
      const response = await api.post('/auth/logout', {});
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Logout failed:", error.response.data);
        return error.response.data;
      } else {
        console.error("Logout error:", error.message);
        return error;
      }
    }
  }

  static async sendVerificationCodeRequest(accessToken) {
    try {
      const response = await api.post('/auth/send-verification-code', {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Send verification code failed:", error.response.data);
        return error.response;
      } else {
        console.error("Send verification code error:", error.message);
        return error;
      }
    }
  }

  static async verifyEmailRequest(code, token) {
    try {
      const response = await api.post('/auth/verify-code', { code }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Email verification failed:", error.response.data);
        return error.response.data;
      } else {
        console.error("Email verification error:", error.message);
        return error;
      }
    }
  }

  static async setupProfileRequest(profileData, token) {
    try {
      const response = await api.post('/users/profile-setup', profileData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Setup profile failed:", error.response.data);
        return error.response.data;
      } else {
        console.error("Setup profile error:", error.message);
        return error;
      }
    }
  }
}

// Exports remain the same
export const getProfileRequest = authAPI.getProfileRequest;
export const loginRequest = authAPI.loginRequest;
export const loginGoogleRequest = authAPI.loginGoogleRequest;
export const registerRequest = authAPI.registerRequest;
export const refreshTokenRequest = authAPI.refreshTokenRequest;
export const logoutRequest = authAPI.logoutRequest;
export const sendVerificationCodeRequest = authAPI.sendVerificationCodeRequest;
export const verifyEmailRequest = authAPI.verifyEmailRequest;
export const setupProfileRequest = authAPI.setupProfileRequest;