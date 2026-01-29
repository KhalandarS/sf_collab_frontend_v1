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

// Waitlist API
export const waitlistAPI = {
  register: async (email, name, id, accessToken) => {
    const response = await api.post("/waitlist/register", { email, name, id }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  },

  getTotalCount: async () => {
    const response = await api.get("/waitlist/count");
    return response.data.data;
  },

  isOnWaitlist: async (email) => {
    const response = await api.post("/waitlist/check", { email });
    return {
      on_waitlist: response.data.data.is_on_waitlist,
      position: response.data.data.position,
    };
  },

  getLeaderboard: async (limit = 10) => {
    const response = await api.get(
      `/waitlist/leaderboard?limit=${limit}`
    );
    return response.data.data;
  },
  getMyRanking: async (userId, accessToken) => {
    const response = await api.get(`/waitlist/me/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  },

  addPoints: async ({ category, points }, accessToken) => {
    const response = await api.post(
      "/waitlist/add-points",
      {
        category, // referral | contribution | activity | new_startup | custom | (small|medium|large)_contribution
        points,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  },
  givePoints: async (userId, category, accessToken) => {
    const response = await api.post(
      "/waitlist/give-points",
      {
        user_id: userId,
        category, // referral | contribution | activity | new_startup | (small|medium|large)_contribution
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  },
  heartbeat: async (userId, accessToken) => {
    const response = await api.get(
      `/waitlist/heartbeat/${userId}`,
      {
        headers: {  
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  },
  sendPhoneVerificationCode: async (userId, email, phone, extension, accessToken) => {

    const response = await api.post("/waitlist/send-verification-code", {
      email,
      phone,
      extension,
      user_id: userId,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  },
  getFeedback: async (params = {}, accessToken) => {
    const response = await api.get("/waitlist/feedback", {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
        ...params
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }
};



export default api

