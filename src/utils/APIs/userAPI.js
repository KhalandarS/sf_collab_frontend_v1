import { API_BASE_URL } from '@/utils/config'
import axios from 'axios'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ FIXED: Request interceptor syntax (Removed the broken try/catch)
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

// ✅ FIXED: Response interceptor (Added safety checks for error.response)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to backend at', API_BASE_URL);
    } else if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    } else if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
)

// Users API
export const usersAPI = {
  // Now these functions will automatically use the token from the interceptor!
  getAll: async (params = {}) => {
    const response = await api.get("/users", {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
        ...params
      },
    });
    return response.data;
  },

  getById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data.data;
  },

  updateProfile: async (userId, profileData, accessToken, dType = 'multipart/form-data') => {
    const response = await api.put(`/users/${userId}`, profileData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': dType,
      },
    });
    return response.data;
  },
  
  getActivity: async (userId) => {
    const response = await api.get(`/users/${userId}/activity`);
    return response.data.data;
  },

  getMyRoles: async () => {
    const response = await api.get('/user-roles/my-roles');
    return response.data;
  },

  submitContactForm: async (contactForm) => {
    const response = await api.post('/users/contact', contactForm, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Added missing roles fetch helper
  getAllRoles: async () => {
    const response = await api.get('/users/roles');
    return response.data.data;

  },
  addRole: async (userId, roles, accessToken) => {
    const response = await api.put(`/user-roles/${userId}`, { roles }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  },
};

export default api;