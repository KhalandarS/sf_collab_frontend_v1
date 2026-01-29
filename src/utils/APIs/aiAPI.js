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
  generateContent: async ({ prompt, model, contentType = 'chat', temperature = 0.7, maxTokens = 2048, outputFormat = 'text', metadata = {} }) => {
    const response = await api.post('/ai/generate', {
      prompt,
      model,
      content_type: contentType,
      metadata,
      temperature,
      max_tokens: maxTokens,
      output_format: outputFormat,
    });
    return response.data;
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
  generateLogo: async ({ brandName, imagesAmount, industry = 'technology', style = 'minimal', colors = [], additionalNotes = '', subtitle = '' }) => {
    const response = await api.post('/ai/logo/generate', {
      brandName,
      industry,
      style,
      colors,
      additionalNotes,
      subtitle,
      imagesAmount
    });
    return response.data;
  },
};

export default api;