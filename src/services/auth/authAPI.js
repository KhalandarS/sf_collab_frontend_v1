import { API_URL } from '@/utils/config';
import axios from 'axios';

// 1. Create a centralized instance
const api = axios.create({
  baseURL: API_URL, // This is usually "http://localhost:5001/api"
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export class authAPI {
  static async loginRequest(credentials) {
    // We only need '/auth/login' because 'api' already knows the baseURL
    const { data } = await api.post('/auth/login', credentials);
    return data;
  }

  static async loginGoogleRequest(credentials) {
    const { data } = await api.post('/auth/google/login', credentials);
    return data;
  }

  static async registerRequest(userData) {
    const { data } = await api.post('/auth/register', userData);
    return data;
  }

  static async refreshTokenRequest(refreshToken) {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data;
  }

  static async getProfileRequest(token) {
    const { data } = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }

  static async logoutRequest(token) {
    await api.post('/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  static async sendVerificationCodeRequest(accessToken) {
    const { data } = await api.post('/auth/send-verification-code', {}, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  }

  static async verifyEmailRequest(code, token) {
    const { data } = await api.post('/auth/verify-code', { code }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }

  static async setupProfileRequest(profileData, token) {
    const { data } = await api.post('/users/profile-setup', profileData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
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