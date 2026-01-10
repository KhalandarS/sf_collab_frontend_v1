import { API_BASE_URL } from '@/utils/config'
import axios from 'axios'

// filepath: /Users/ivandavidgomezsilva/Documents/Ivan/Trabajos/SFORGER/SForger_data/SFRepos/sf_collab_frontend_v1/src/utils/APIs/aiAPI.js

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor with token
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

// Response interceptor for error handling
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
);

// AI API
export const aiAPI = {
  // Health check
  getHealth: async () => {
    const response = await api.get('/ai/health');
    return response.data;
  },

  // Get available models
  getAvailableModels: async () => {
    const response = await api.get('/ai/models');
    return response.data.data;
  },

  // Generate content (business plan, pitch deck, etc.)
  generateContent: async (prompt, model, contentType = 'chat', temperature = 0.7, maxTokens = 2048, outputFormat = 'text') => {
    const response = await api.post('/ai/generate', {
      prompt,
      model,
      content_type: contentType,
      temperature,
      max_tokens: maxTokens,
      output_format: outputFormat,
    });
    return response.data.data;
  },

  // Chat endpoint
  chat: async (messages, model, temperature = 0.7, maxTokens = 2048) => {
    const response = await api.post('/ai/chat', {
      messages,
      model,
      temperature,
      max_tokens: maxTokens,
    });
    return response.data.data;
  },

  // Download generated content
  downloadContent: async (filename) => {
    const response = await api.get(`/ai/download/${filename}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Generate logo
  generateLogo: async ({ brandName, imagesAmount, industry = 'technology', style = 'minimal', colors = [], additionalNotes = '', subtitle = '', accessToken }) => {
    const response = await api.post('/ai/logo/generate', {
      brandName,
      industry,
      style,
      colors,
      additionalNotes,
      subtitle,
      imagesAmount
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};

export default api;