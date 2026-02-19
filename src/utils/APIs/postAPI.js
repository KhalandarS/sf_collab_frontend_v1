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
  getAll: async (params) => {
    const response = await api.get('/posts', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
        search: params.search,
      },
    })
    return response.data
  },

  getById: async (postId) => {
    const response = await api.get(`/posts/${postId}`)
    return response.data
  },

  create: async (postData) => {
    const response = await api.post('/posts', postData)
    return response.data
  },

  update: async (postId, postData) => {
    const response = await api.put(`/posts/${postId}`, postData)
    return response.data
  },

  delete: async (postId) => {
    const response = await api.delete(`/posts/${postId}`)
    return response.data
  },

  like: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`, {})
    return response.data
  },

  unlike: async (postId) => {
    const response = await api.post(`/posts/${postId}/unlike`, {})
    return response.data
  },

  getTags: async (postId) => {
    const response = await api.get(`/posts/${postId}/tags`)
    return response.data
  },

  getComments: async (postId, params) => {
    const response = await api.get(`/posts/${postId}/comments`, {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
      },
    })
    return response.data
  },

  addComment: async (postId, content) => {
    const response = await api.post(`/posts/${postId}/comments`, { text: content })
    return response.data
  },

  deleteComment: async (postId, commentId) => {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`)
    return response.data
  },

  getLikes: async (postId) => {
    const response = await api.get(`/posts/${postId}/likes`)
    return response.data
  },

  getMedia: async (postId) => {
    const response = await api.get(`/posts/${postId}`)
    return response.data
  },

  addMedia: async (postId, mediaData) => {
    const response = await api.post(`/posts/${postId}`, mediaData)
    return response.data
  },

  deleteMedia: async (postId, mediaId) => {
    const response = await api.delete(`/posts/${postId}`)
    return response.data
  },

  // Stories API
  getStories: async (params) => {
    const response = await api.get('/stories', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 20,
        user_id: params.user_id,
        author_id: params.author_id,
        type: params.type,
        active_only: params.active_only ?? true,
        include_viewers: params.include_viewers ?? false,
        current_user_id: params.current_user_id,
      },
    })
    return response.data
  },

  getStoryById: async (storyId, params) => {
    const response = await api.get(`/stories/${storyId}`, {
      params: {
        include_viewers: params?.include_viewers ?? false,
        current_user_id: params?.current_user_id,
      },
    })
    return response.data
  },

  createStory: async (storyData) => {
    const response = await api.post('/stories', storyData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  updateStory: async (storyId, storyData) => {
    const response = await api.put(`/stories/${storyId}`, storyData)
    return response.data
  },

  viewStory: async (storyId, userId) => {
    const response = await api.post(`/stories/${storyId}/view`, { user_id: userId })
    return response.data
  },

  getActiveStories: async (userIds, currentUserId) => {
    const response = await api.get('/stories/active', {
      params: {
        user_ids: userIds,
        current_user_id: currentUserId,
      },
    })
    return response.data
  },

  deleteStory: async (storyId) => {
    const response = await api.delete(`/stories/${storyId}`)
    return response.data
  },
}

export default api
