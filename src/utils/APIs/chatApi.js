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

// Chat API
export const chatAPI = {
  // Add your endpoints here
  getAllChats: async (accessToken) => {
    const response = await api.get("/chats", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  },
  
  sendDirectMessage: async (recipientUserId, content, accessToken) => {
    const response = await api.post('/chat/direct', { recipient_user_id: recipientUserId, content }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  },

  getConversationById: async (conversationId, accessToken) => {
    const response = await api.get(`/chat/conversations/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  },
};

export default api