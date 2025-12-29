import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

console.log('API Base URL:', API_BASE_URL) // Debug: Check API URL

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
  signup: async (email, name) => {
    const response = await api.post('/waitlist/signup', { email, name })
    return response.data
  },

  getPosition: async (email) => {
    const response = await api.get(`/waitlist/position/${email}`)
    return response.data
  },

  getStats: async () => {
    const response = await api.get('/waitlist/stats')
    return response.data
  },

  getAll: async () => {
    const response = await api.get('/waitlist/all')
    return response.data
  },
}

// Referral API
export const referralAPI = {
  register: async (email, name) => {
    const response = await api.post('/referral/register', { email, name })
    return response.data
  },
  
  invite: async (referrerEmail, contactEmail, contactName) => {
    const response = await api.post('/referral/invite', {
      referrer_email: referrerEmail,
      contact_email: contactEmail,
      contact_name: contactName,
    })
    return response.data
  },
  
  getUserReferrals: async (email) => {
    const response = await api.get(`/referral/user/${email}`)
    return response.data
  },
  
  claimReward: async (email, weeks) => {
    const response = await api.post('/referral/claim', { email, weeks })
    return response.data
  },
  
  getStats: async () => {
    const response = await api.get('/referral/stats')
    return response.data
  },
}

export default api

