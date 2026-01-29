import { API_BASE_URL } from '@/utils/config'
import axios from 'axios'
import { requestErrorInterceptor, requestInterceptor, responseErrorInterceptor, responseInterceptor } from './interceptors';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor
);

api.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);
// Users API
export const usersAPI = {
  // Now these functions will automatically use the token from the interceptor!
  getAll: async (params = {}, accessToken = '') => {
    const response = await api.get("/users", {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
        ...params
      },
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`,
      } : {}
    });
    console.log(response.data);
    return response.data;
  },

  getById: async (userId, accessToken) => {
    const response = await api.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
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