import { API_BASE_URL } from '@/utils/config'
import axios from 'axios'

// filepath: /Users/ivandavidgomezsilva/Documents/Ivan/Trabajos/SFORGER/SForger_data/SFRepos/sf_collab_frontend_v1/src/utils/APIs/dashboardAPI.js

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to backend at', API_BASE_URL)
    } else if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    } else if (error.response) {
      console.error('API Error:', error.response.status, error.response.data)
    }
    return Promise.reject(error)
  }
)

// Dashboard API
export const dashboardAPI = {
  // Get founder dashboard
  getFounderDashboard: async () => {
    const response = await api.get('/dashboard/founder')
    console.log("Response:", response);
    return response.data
  },

  // Get builder dashboard
  getBuilderDashboard: async () => {
    const response = await api.get('/dashboard/builder')
    return response.data
  },

  // Get dashboard overview
  getOverview: async () => {
    const response = await api.get('/dashboard/overview')
    return response.data
  },
}

export default api