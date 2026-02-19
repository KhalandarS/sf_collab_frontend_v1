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

// Posts API
export const postAPI = {
  getAll: async (accessToken, params) => {
    const response = await api.get('/api/profile/posts', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
        search: params.search,
      },
    })
    return response.data
  },

  getById: async (postId, accessToken) => {
    const response = await api.get(`/api/profile/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  },

  create: async (postData, accessToken) => {
    const response = await api.post('/api/profile/posts', postData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Don't set Content-Type for multipart/form-data - let axios handle it
      },
    })
    return response.data
  },

  update: async (postId, postData, accessToken) => {
    const response = await api.put(`/api/profile/posts/${postId}`, postData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  },

  delete: async (postId, accessToken) => {
    const response = await api.delete(`/api/profile/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  },

  like: async (postId, accessToken) => {
    const response = await api.post(`/api/profile/posts/${postId}/like`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  },

  unlike: async (postId, accessToken) => {
    const response = await api.post(`/api/profile/posts/${postId}/unlike`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  },

  getTags: async (postId, accessToken) => {
    const response = await api.get(`/api/profile/posts/${postId}/tags`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  },

  getComments: async (postId, accessToken, params) => {
    const response = await api.get(`/api/profile/posts/${postId}/comments`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
      },
    })
    return response.data
  },

  addComment: async (postId, content, accessToken) => {
    const response = await api.post(`/api/profile/posts/${postId}/comments`, { text: content }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  },

  deleteComment: async (postId, commentId, accessToken) => {
    const response = await api.delete(`/api/profile/posts/${postId}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  },

  getLikes: async (postId, accessToken) => {
    const response = await api.get(`/api/profile/posts/${postId}/likes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  },

  getMedia: async (postId, accessToken) => {
    const response = await api.get(`/api/profile/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  },

  addMedia: async (postId, mediaData, accessToken) => {
    const response = await api.post(`/api/profile/posts/${postId}`, mediaData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  },

  deleteMedia: async (postId, mediaId, accessToken) => {
    const response = await api.delete(`/api/profile/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  },
}

export default api