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
    // console.log('API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    // console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Axios: if request never reached server (CORS, network), response is undefined
    const status = error?.response?.status;
    const msg = error?.response?.data?.msg;
    const data = error?.response?.data;

    // ECONNREFUSED is more common in Node; in browser you’ll usually get "Network Error"
    if (!error?.response) {
      console.error("❌ API network/CORS error:", error?.message || error);
      console.error("   Backend URL:", API_BASE_URL);
      return Promise.reject(error);
    }

    // JWT expired
    if (status === 401 && msg === "Token has expired") {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    console.error("API Error:", status, data);
    return Promise.reject(error);
  }
);


// Users API
export const usersAPI = {
  
  getAll: async (accessToken, params) => {
    const response = await api.get("/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
        status: params.status,
        role: params.role,
        search: params.search,
      },
    });
    return response.data;
  },

  getById: async (userId, accessToken) => {
    const response = await api.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  },

  updateProfile: async (userId, profileData, accessToken) => {
    const response = await api.put(`/users/${userId}`, profileData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
  
  getActivity: async (userId, accessToken) => {
    const response = await api.get(`/users/${userId}/activity`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  },

  getStatus: async (userId, accessToken) => {
    const response = await api.get(`/users/${userId}/status`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  },

  verifyEmail: async (userId, accessToken) => {
    const response = await api.post(`/users/${userId}/verify-email`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  },

  getXP: async (userId, accessToken) => {
    const response = await api.get(`/users/${userId}/xp`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  },

  getAvatar: async (filename) => {
    const response = await api.get(`/users/avatars/${filename}`);
    return response.data;
  },

  getUpload: async (filename) => {
    const response = await api.get(`/users/uploads/${filename}`);
    return response.data;
  },
  
  submitContactForm: async (contactForm) => {
    const response = await api.post('/users/contact', contactForm,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;

  },
  getAllRoles: async () => {
    const response = await api.get('/users/roles');
    return response.data.data;

  },
  getMyRoles: async (accessToken) => {
    const response = await api.get('/user-roles/my-roles', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }
};



export default api

