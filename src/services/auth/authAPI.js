import { API_URL } from '@/utils/config';
import axios from 'axios';

//This file centralizes all API calls.

const API_URL_AUTH = API_URL + '/auth';

export class authAPI {
  static async loginRequest(credentials) {
    const { data } = await axios.post(`${API_URL_AUTH}/login`, credentials);
    return data;
  }

  static async loginGoogleRequest(credentials) {
    const { data } = await axios.post(`${API_URL_AUTH}/google/login`, credentials);
    return data;
  }

  static async registerRequest(userData) {
    const { data } = await axios.post(`${API_URL_AUTH}/register`, userData);
    return data;
  }

  static async refreshTokenRequest(refreshToken) {
    const { data } = await axios.post(`${API_URL_AUTH}/refresh`, { refreshToken });
    return data;
  }

  static async getProfileRequest(token) {
    const { data } = await axios.get(`${API_URL_AUTH}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }

  static async logoutRequest(token) {
    await axios.post(`${API_URL_AUTH}/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  static async sendVerificationCodeRequest(accessToken) {
    const { data } = await axios.post(`${API_URL_AUTH}/send-verification-code`, {}, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  }

  static async verifyEmailRequest(code, token) {
    const { data } = await axios.post(`${API_URL_AUTH}/verify-code`,
      { code }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
}

export const getProfileRequest = authAPI.getProfileRequest;
export const loginRequest = authAPI.loginRequest;
export const loginGoogleRequest = authAPI.loginGoogleRequest;
export const registerRequest = authAPI.registerRequest;
export const refreshTokenRequest = authAPI.refreshTokenRequest;
export const logoutRequest = authAPI.logoutRequest;
export const sendVerificationCodeRequest = authAPI.sendVerificationCodeRequest;
export const verifyEmailRequest = authAPI.verifyEmailRequest;