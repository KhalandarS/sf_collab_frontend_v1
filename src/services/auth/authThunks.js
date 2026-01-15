import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginRequest,
  registerRequest,
  refreshTokenRequest,
  getProfileRequest,
  loginGoogleRequest
} from './authAPI';

// LOGIN
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginRequest(credentials);
      console.log('From login user:', data);
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginGoogleUser = createAsyncThunk(
  'auth/loginGoogleUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginGoogleRequest(credentials);
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      return await registerRequest(userData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// FETCH PROFILE
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No token found');
      return await getProfileRequest(token);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// REFRESH TOKEN
export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token found');

      const data = await refreshTokenRequest(refreshToken);

      // 🔥 Make sure to match backend response keys (Flask usually returns `access_token`)
      if (data.access_token) {
        localStorage.setItem('accessToken', data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem('refreshToken', data.refresh_token);
      }

      return data.access_token;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// LOGOUT
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  return true;
});
