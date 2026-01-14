import { API_BASE_URL } from '@/utils/config'
import axios from 'axios'

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

// Startups API
export const startupsAPI = {
  // Get all startups with filters
  getAll: async (params = {}) => {
    const response = await api.get('/api/startups', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
        ...params,
      },
    })
    return response.data.data
  },

  // Get single startup
  getById: async (startupId) => {
    const response = await api.get(`/api/startups/${startupId}`)
    return response.data.data
  },

  // Register new startup
  register: async (formData) => {
    const response = await api.post('/api/startups/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },

  // Update startup
  update: async (startupId, data) => {
    const response = await api.put(`/api/startups/${startupId}`, data)
    return response.data.data
  },

  // Delete startup
  delete: async (startupId) => {
    const response = await api.delete(`/api/startups/${startupId}`)
    return response.data
  },

  // Get startup members
  getMembers: async (startupId) => {
    const response = await api.get(`/api/startups/${startupId}/members`)
    return response.data.data
  },

  // Add member to startup
  addMember: async (startupId, memberData) => {
    const response = await api.post(
      `/api/startups/${startupId}/members`,
      memberData
    )
    return response.data.data
  },

  // Remove member from startup
  removeMember: async (startupId, memberId) => {
    const response = await api.delete(
      `/api/startups/${startupId}/members/${memberId}`
    )
    return response.data
  },

  // Get startup documents
  getDocuments: async (startupId) => {
    const response = await api.get(`/api/startups/${startupId}/documents`)
    return response.data.data
  },

  // Upload document
  uploadDocument: async (startupId, formData) => {
    const response = await api.post(
      `/api/startups/${startupId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  },

  // Delete document
  deleteDocument: async (startupId, documentId) => {
    const response = await api.delete(
      `/api/startups/${startupId}/documents/${documentId}`
    )
    return response.data
  },

  // Download document
  downloadDocument: async (startupId, documentId) => {
    const response = await api.get(
      `/api/startups/${startupId}/documents/${documentId}/download`,
      {
        responseType: 'blob',
      }
    )
    return response.data
  },

  // Get startup stats
  getStats: async (startupId) => {
    const response = await api.get(`/api/startups/${startupId}/stats`)
    return response.data.data
  },

  // Get user's startups
  getUserStartups: async (userId, params = {}) => {
    const response = await api.get(`/api/startups/user/${userId}`, {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
        ...params,
      },
    })
    return response.data.data
  },

  // Get industries
  getIndustries: async () => {
    const response = await api.get('/api/startups/industries')
    return response.data.data
  },

  // Get stages
  getStages: async () => {
    const response = await api.get('/api/startups/stages')
    return response.data.data
  },

  // Get join requests
  getJoinRequests: async (startupId, params = {}) => {
    const response = await api.get(`/api/startups/${startupId}/join-requests`, {
      params: {
        status: params.status || 'pending',
        ...params,
      },
    })
    return response.data.data
  },

  // Accept join request
  acceptJoinRequest: async (startupId, requestId) => {
    const response = await api.post(
      `/api/startups/${startupId}/join-requests/${requestId}/accept`
    )
    return response.data.data
  },

  // Reject join request
  rejectJoinRequest: async (startupId, requestId) => {
    const response = await api.post(
      `/api/startups/${startupId}/join-requests/${requestId}/reject`
    )
    return response.data.data
  },

  // Cancel own join request
  cancelJoinRequest: async (requestId) => {
    const response = await api.post(
      `/api/startups/join-requests/${requestId}/cancel`
    )
    return response.data.data
  },
}

export default api