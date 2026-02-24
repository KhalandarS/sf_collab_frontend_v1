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

// Posts API
export const postsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/posts', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
        user_id: params.userId,
        author_id: params.authorId,
        type: params.postType,
        search: params.search,
        include_comments: params.includeComments || false,
        include_media: params.includeMedia || false,
        current_user_id: params.currentUserId,
      },
    })
    return response.data
  },

  getById: async (postId, params = {}) => {
    const response = await api.get(`/posts/${postId}`, {
      params: {
        include_comments: params.includeComments || false,
        include_media: params.includeMedia || false,
        current_user_id: params.currentUserId,
      },
    })
    return response.data
  },

  create: async (postData) => {
    const response = await api.post('/posts', postData)
    return response.data
  },

  update: async (postId, postData) => {
    const response = await api.put(`/posts/${postId}`, postData)
    return response.data
  },

  delete: async (postId) => {
    const response = await api.delete(`/posts/${postId}`)
    return response.data
  },

  like: async (postId, userId) => {
    const response = await api.post(`/posts/${postId}/like`, { user_id: userId })
    return response.data
  },

  unlike: async (postId, userId) => {
    const response = await api.post(`/posts/${postId}/unlike`, { user_id: userId })
    return response.data
  },

  addTag: async (postId, tag) => {
    const response = await api.post(`/posts/${postId}/tags`, { tag })
    return response.data
  },
}

// Stories API
export const storiesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/stories', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 20,
        user_id: params.userId,
        author_id: params.authorId,
        type: params.storyType,
        active_only: params.activeOnly !== false,
        include_viewers: params.includeViewers || false,
        current_user_id: params.currentUserId,
      },
    })
    return response.data
  },

  getById: async (storyId, params = {}) => {
    const response = await api.get(`/stories/${storyId}`, {
      params: {
        include_viewers: params.includeViewers || false,
        current_user_id: params.currentUserId,
      },
    })
    return response.data
  },

  create: async (storyData) => {
    const response = await api.post('/stories', storyData)
    return response.data
  },

  update: async (storyId, storyData) => {
    const response = await api.put(`/stories/${storyId}`, storyData)
    return response.data
  },

  view: async (storyId, userId) => {
    const response = await api.post(`/stories/${storyId}/view`, { user_id: userId })
    return response.data
  },

  getActive: async (userIds, currentUserId) => {
    const response = await api.get('/stories/active', {
      params: {
        user_ids: userIds,
        current_user_id: currentUserId,
      },
    })
    return response.data
  },

  delete: async (storyId) => {
    const response = await api.delete(`/stories/${storyId}`)
    return response.data
  },
}

// User Social API
export const userSocialAPI = {
  followUser: async (userId) => {
    const response = await api.post(`/user-social/${userId}/follow`)
    return response.data
  },

  unfollowUser: async (userId) => {
    const response = await api.post(`/user-social/${userId}/unfollow`)
    return response.data
  },

  getFollowers: async (userId, params = {}) => {
    const response = await api.get(`/user-social/${userId}/followers`, {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
      },
    })
    return response.data
  },

  getFollowing: async (userId, params = {}) => {
    const response = await api.get(`/user-social/${userId}/following`, {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
      },
    })
    return response.data
  },

  likePost: async (userId, postId) => {
    const response = await api.post(`/user-social/${userId}/like-post`, { post_id: postId })
    return response.data
  },

  unlikePost: async (userId, postId) => {
    const response = await api.post(`/user-social/${userId}/unlike-post`, { post_id: postId })
    return response.data
  },

  savePost: async (userId, postId) => {
    const response = await api.post(`/user-social/${userId}/save-post`, { post_id: postId })
    return response.data
  },

  unsavePost: async (userId, postId) => {
    const response = await api.post(`/user-social/${userId}/unsave-post`, { post_id: postId })
    return response.data
  },

  blockUser: async (userId, blockedUserId) => {
    const response = await api.post(`/user-social/${userId}/block/${blockedUserId}`)
    return response.data
  },

  unblockUser: async (userId, blockedUserId) => {
    const response = await api.post(`/user-social/${userId}/unblock/${blockedUserId}`)
    return response.data
  },

  muteUser: async (userId, mutedUserId) => {
    const response = await api.post(`/user-social/${userId}/mute/${mutedUserId}`)
    return response.data
  },

  unmuteUser: async (userId, mutedUserId) => {
    const response = await api.post(`/user-social/${userId}/unmute/${mutedUserId}`)
    return response.data
  },

  updatePreferences: async (userId, preferences) => {
    const response = await api.put(`/user-social/${userId}/preferences`, preferences)
    return response.data
  },

  updateInterestTags: async (userId, tags) => {
    const response = await api.put(`/user-social/${userId}/interest-tags`, { tags })
    return response.data
  },

  updateMatchPreferences: async (userId, preferences) => {
    const response = await api.put(`/user-social/${userId}/match-preferences`, { preferences })
    return response.data
  },

  getSocialProfile: async (userId) => {
    const response = await api.get(`/user-social/${userId}`)
    return response.data
  },

  updatePrivacySettings: async (userId, settings) => {
    const response = await api.put(`/user-social/${userId}/privacy`, settings)
    return response.data
  },

  getEngagementRate: async (userId) => {
    const response = await api.get(`/user-social/${userId}/engagement-rate`)
    return response.data
  },

  getSuggestions: async (limit = 5) => {
  const response = await api.get('/user-social/suggestions', {
      params: {
        limit,
      },
    })
    return response.data
  },

  searchUsers: async (query, params = {}) => {
    const response = await api.get('/users', {
      params: {
        search: query,
        page: params.page || 1,
        per_page: params.per_page || 10,
        ...params,
      },
    })
    return response.data
  },
}

export default api
