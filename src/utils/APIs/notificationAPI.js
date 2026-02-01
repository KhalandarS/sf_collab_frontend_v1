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

// Notification API
export const notificationAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/notifications', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 20,
        ...params
      },
    });
    return response.data;
  },
  
  getById: async (notificationId) => {
    const response = await api.get(`/notifications/${notificationId}`);
    return response.data;
  },

  create: async (notificationData) => {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.post(`/notifications/${notificationId}/read`, {}, );
    return response.data;
  },

  markAsUnread: async (notificationId) => {
    const response = await api.post(`/notifications/${notificationId}/unread`, {});
    return response.data;
  },

  markBatchRead: async (notificationIds) => {
    const response = await api.post('/notifications/batch/read', { notification_ids: notificationIds });
    return response.data;
  },

  getUnreadCount: async (userId) => {
    const response = await api.get(`/notifications/user/${userId}/unread-count`);
    return response.data;
  },

  getCurrentUserUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAllRead: async () => {
    const response = await api.post('/notifications/mark-all-read', {});
    return response.data;
  },

  delete: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  deleteAllRead: async () => {
    const response = await api.delete('/notifications/delete-all-read');
    return response.data;
  },

  bulkMarkRead: async (notificationIds) => {
    const response = await api.post('/notifications/bulk/mark-read', { notificationIds });
    return response.data;
  },

  bulkDelete: async (notificationIds) => {
    const response = await api.post('/notifications/bulk/delete', { notificationIds });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/notifications/stats');
    return response.data;
  },

  getPreferences: async () => {
    const response = await api.get('/notifications/preferences');
    return response.data;
  },

  updatePreferences: async (preferencesData) => {
    const response = await api.put('/notifications/preferences', preferencesData);
    return response.data;
  },
};

export default api;