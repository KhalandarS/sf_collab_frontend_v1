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

// Payment API
export const paymentAPI = {
  // Get all plans with optional type filter
  getPlans: async (type = null) => {
    const response = await api.get('/payments/plans', {
      params: type ? { type } : {},
    })
    return response.data
  },

  // Get specific plan by ID
  getPlanById: async (planId) => {
    const response = await api.get(`/payments/plans/${planId}`)
    return response.data
  },

  // Create payment intent
  createPaymentIntent: async (priceId) => {
    const response = await api.post('/payments/create-payment-intent', {
      priceId,
    })
    return response.data
  },

  // Create checkout session
  createCheckoutSession: async (checkoutData) => {
    const response = await api.post('/payments/create-checkout-session', checkoutData)
    return response.data
  },

  // Get checkout session details
  getCheckoutSession: async (sessionId) => {
    const response = await api.get(`/payments/checkout-session/${sessionId}`)
    return response.data
  },

  // Record transaction
  recordTransaction: async (transactionData) => {
    const response = await api.post('/payments/record-transaction', transactionData)
    return response.data
  },

  // Create donation session
  createDonationSession: async (donationData) => {
    const response = await api.post('/payments/create-donation-session', donationData)
    return response.data
  },

  // Get total donations
  getTotalDonations: async (params) => {
    const response = await api.get('/payments/donations', { ...params })
    return response.data
  },

  // Get total crowdfunding
  getTotalCrowdfunding: async (params) => {
    const response = await api.get('/payments/crowdfunding', { ...params })
    return response.data
  },

  getCredits: async () => {
    const response = await api.get('/payments/credits');
    return response.data;
  }
}

export default api