import { API_BASE_URL } from '@/utils/config';
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to backend. Make sure Flask is running on', API_BASE_URL);
    } else if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Contribution API
export const contributionAPI = {
  createIdea: async (ideaData, accessToken) => {
    const response = await api.post('/contribution-ideas', ideaData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  getAllIdeas: async (params, accessToken) => {
    const response = await api.get('/contribution-ideas', { 
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  getIdeaById: async (ideaId) => {
    const response = await api.get(`/contribution-ideas/${ideaId}`);
    return response.data;
  },

  updateIdea: async (ideaId, ideaData, accessToken) => {
    const response = await api.put(`/contribution-ideas/${ideaId}`, ideaData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  deleteIdea: async (ideaId, accessToken) => {
    const response = await api.delete(`/contribution-ideas/${ideaId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  getUserIdeas: async (userId, params) => {
    const response = await api.get(`/contribution-ideas/user/${userId}`, { params });
    return response.data;
  },
  createPoll: async (pollData, accessToken) => {
    const response = await api.post('/contribution-polls', pollData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  getAllPolls: async (params, accessToken) => {
    const response = await api.get('/contribution-polls', { 
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  },

  getPollById: async (pollId) => {
    const response = await api.get(`/contribution-polls/${pollId}`);
    return response.data;
  },

  updatePoll: async (pollId, pollData, accessToken) => {
    const response = await api.put(`/contribution-polls/${pollId}`, pollData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  deletePoll: async (pollId, accessToken) => {
    const response = await api.delete(`/contribution-polls/${pollId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  autoDeletePolls: async () => {
    const response = await api.post('/contribution-polls/auto-delete');
    return response.data;
  },
  voteInPoll: async (pollId, optionIndex, accessToken) => {
    const response = await api.post(`/contribution-polls/${pollId}/vote`, 
      { option_index: optionIndex },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }
};

export default api;