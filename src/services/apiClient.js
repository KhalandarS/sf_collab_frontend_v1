// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api',
});

apiClient.interceptors.request.use((config) => {
  // We check BOTH common names just in case
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;