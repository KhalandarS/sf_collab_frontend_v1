import { API_BASE_URL } from '@/utils/config'
import axios from 'axios'





const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to backend. Make sure Flask is running on', API_BASE_URL)
      console.error('   Start backend with: python3 waitlist_referral_app.py')
    } else if (error.response) {
      console.error('API Error:', error.response.status, error.response.data)
    } else {
      console.error('API Error:', error.message)
    }
    return Promise.reject(error)
  }
)

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

  addPoints: async ({ userId, category }, accessToken) => {
    const response = await api.post(
      "/waitlist/add-points",
      {
        user_id: userId,
        category, // referral | contribution | activity
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
};



export default api

