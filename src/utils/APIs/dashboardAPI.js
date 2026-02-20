import { API_BASE_URL } from '@/utils/config'
import axios from 'axios'
import { requestErrorInterceptor, requestInterceptor, responseErrorInterceptor, responseInterceptor } from './interceptors';

// filepath: /Users/ivandavidgomezsilva/Documents/Ivan/Trabajos/SFORGER/SForger_data/SFRepos/sf_collab_frontend_v1/src/utils/APIs/dashboardAPI.js

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

  getUserProfile: async (userId) => {
    const response = await api.get(`/dashboard/profile/${userId}`)
    return response.data
  }
}

export default api