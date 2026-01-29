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

// Idea API
export const ideaAPI = {
  getAllIdeas: async (accessToken, params) => {
    const response = await api.get("/ideas", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: params,
    });
    return response.data;
  },

  getIdeaById: async (ideaId, accessToken) => {
    const response = await api.get(`/ideas/${ideaId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  createIdea: async (ideaData, accessToken, headers) => {
    const response = await api.post('/ideas', ideaData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...headers,
      },
    });
    return response.data;
  },

  updateIdea: async (ideaId, ideaData, accessToken) => {
    const response = await api.put(`/ideas/${ideaId}`, ideaData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  deleteIdea: async (ideaId, accessToken) => {
    const response = await api.delete(`/ideas/${ideaId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
  likeIdea: async (ideaId, accessToken) => {
    const response = await api.post(`/ideas/${ideaId}/like`, {}, {
      headers: {
      Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
    },

    addTeamMember: async (ideaId, memberData, accessToken) => {
    const response = await api.post(`/ideas/${ideaId}/team-members`, memberData, {
      headers: {
      Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
    },
  // Idea Comments API
  getIdeaComments: async (accessToken, params) => {
    const response = await api.get("/idea-comments", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: params,
    });
    return response.data;
  },

  createIdeaComment: async (commentData, accessToken) => {
    const response = await api.post('/idea-comments', commentData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  updateIdeaComment: async (commentId, commentData, accessToken) => {
    const response = await api.put(`/idea-comments/${commentId}`, commentData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  deleteIdeaComment: async (commentId, accessToken) => {
    const response = await api.delete(`/idea-comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
  // Idea Bookmarks API
  getIdeaBookmarks: async (accessToken, params) => {
    const response = await api.get("/idea-bookmarks", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: params,
    });
    return response.data;
  },

  getIdeaBookmark: async (bookmarkId, accessToken) => {
    const response = await api.get(`/idea-bookmarks/${bookmarkId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  createIdeaBookmark: async (bookmarkData, accessToken) => {
    const response = await api.post('/idea-bookmarks', bookmarkData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  updateIdeaBookmark: async (bookmarkId, bookmarkData, accessToken) => {
    const response = await api.put(`/idea-bookmarks/${bookmarkId}`, bookmarkData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  checkIdeaBookmark: async (userId, ideaId, accessToken) => {
    const response = await api.get(`/idea-bookmarks/user/${userId}/idea/${ideaId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  removeIdeaBookmark: async (userId, ideaId, accessToken) => {
    const response = await api.delete(`/idea-bookmarks/user/${userId}/idea/${ideaId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  deleteIdeaBookmark: async (bookmarkId, accessToken) => {
    const response = await api.delete(`/idea-bookmarks/${bookmarkId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};

export default api;