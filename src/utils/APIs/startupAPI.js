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
    const response = await api.get('/startups', {
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
    const response = await api.get(`/startups/${startupId}`)
    return response.data.data
  },

  // Register new startup
  register: async (formData) => {
    const response = await api.post('/startups/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },

  // Update startup
  update: async (startupId, data) => {
    const response = await api.put(`/startups/${startupId}`, data)
    return response.data.data
  },

  // Delete startup
  delete: async (startupId) => {
    const response = await api.delete(`/startups/${startupId}`)
    return response.data
  },

  // Get startup members
  getMembers: async (startupId) => {
    const response = await api.get(`/startups/${startupId}/members`)
    return response.data.data
  },

  // Add member to startup
  addMember: async (startupId, memberData) => {
    const response = await api.post(
      `/startups/${startupId}/members`,
      memberData
    )
    return response.data.data
  },

  // Remove member from startup
  removeMember: async (startupId, memberId) => {
    const response = await api.delete(
      `/startups/${startupId}/members/${memberId}`
    )
    return response.data
  },

  // Get startup documents
  getDocuments: async (startupId) => {
    const response = await api.get(`/startups/${startupId}/documents`)
    return response.data.data
  },

  // Upload document
  uploadDocument: async (startupId, formData) => {
    const response = await api.post(
      `/startups/${startupId}/documents`,
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
      `/startups/${startupId}/documents/${documentId}`
    )
    return response.data
  },

  // Download document
  downloadDocument: async (startupId, documentId) => {
    const response = await api.get(
      `/startups/${startupId}/documents/${documentId}/download`,
      {
        responseType: 'blob',
      }
    )
    return response.data
  },

  // Get startup stats
  getStats: async (startupId) => {
    const response = await api.get(`/startups/${startupId}/stats`)
    return response.data.data
  },

  // Get user's startups
  getUserStartups: async (userId, params = {}) => {
    const response = await api.get(`/startups/user/${userId}`, {
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
    const response = await api.get('/startups/industries')
    return response.data.data
  },

  // Get stages
  getStages: async () => {
    const response = await api.get('/startups/stages')
    return response.data.data
  },

  // Get join requests
  getJoinRequests: async (startupId, params = {}) => {
    const response = await api.get(`/startups/${startupId}/join-requests`, {
      params: {
        status: params.status || 'pending',
        ...params,
      },
    })
    return response.data.data
  },
  // Send a join request as a regular user
  sendJoinRequest: async (startupId, payload) => {
    try {
      // Use the axios instance which already has the correct baseURL (/api in dev)
      const response = await api.post(`/startups/${startupId}/join-request`, payload)
      return response.data.data
    } catch (error) {
      console.error('Error sending join request:', error)
      throw error
    }
  },

  // Accept join request
  acceptJoinRequest: async (startupId, requestId) => {
    const response = await api.post(
      `/startups/${startupId}/join-requests/${requestId}/accept`
    )
    return response.data.data
  },

  // Reject join request
  rejectJoinRequest: async (startupId, requestId) => {
    const response = await api.post(
      `/startups/${startupId}/join-requests/${requestId}/reject`
    )
    return response.data.data
  },

  // Cancel own join request
  cancelJoinRequest: async (requestId) => {
    const response = await api.post(
      `/startups/join-requests/${requestId}/cancel`
    )
    return response.data.data
  },
}

export default api