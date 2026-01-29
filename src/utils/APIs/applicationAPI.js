import { API_BASE_URL } from '@/utils/config'
import axios from 'axios'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to backend at', API_BASE_URL);
    } else if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);


// Application API
export const applicationAPI = {
  
  getAll: async (accessToken, params) => {
    const response = await api.get("/applications", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
        type: params.type,
        search: params.search,
      },
    });
    return response.data;
  },

  getJobApplications: async (accessToken, params) => {
    const response = await api.get("/applications/jobs", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
        search: params.search,
      },
    });
    return response.data;
  },

  getInfluencerApplications: async (accessToken, params) => {
    const response = await api.get("/applications/influencers", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
        search: params.search,
      },
    });
    return response.data;
  },

  getById: async (applicationId, accessToken) => {
    const response = await api.get(`/applications/${applicationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  createJobApplication: async (applicationData) => {
    const response = await api.post("/applications/jobs", applicationData);
    return response.data;
  },

  createInfluencerApplication: async (applicationData) => {
    const response = await api.post("/applications/influencers", applicationData);
    return response.data;
  },

  delete: async (applicationId, accessToken) => {
    const response = await api.delete(`/applications/${applicationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};

export default api