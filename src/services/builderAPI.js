/**
 * Builder API Service
 * Handles all API calls related to builder functionality
 */

import { API_URL } from '@/utils/config';

const API_BASE = `${API_URL}/builder`;

/**
 * Builder Profile APIs
 */
export const builderProfileAPI = {
  // Get builder's profile
  getProfile: async (accessToken) => {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch builder profile');
    return response.json();
  },

  // Update builder's profile
  updateProfile: async (profileData, accessToken) => {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) throw new Error('Failed to update builder profile');
    return response.json();
  },

  // Add skill to profile
  addSkill: async (skillData, accessToken) => {
    const response = await fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(skillData),
    });
    if (!response.ok) throw new Error('Failed to add skill');
    return response.json();
  },

  // Remove skill from profile
  removeSkill: async (skillId, accessToken) => {
    const response = await fetch(`${API_BASE}/skills/${skillId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to remove skill');
    return response.json();
  },

  // Get portfolio items
  getPortfolio: async (accessToken) => {
    const response = await fetch(`${API_BASE}/portfolio`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch portfolio');
    return response.json();
  },

  // Add portfolio item
  addPortfolioItem: async (itemData, accessToken) => {
    const response = await fetch(`${API_BASE}/portfolio`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error('Failed to add portfolio item');
    return response.json();
  },

  // Remove portfolio item
  removePortfolioItem: async (itemId, accessToken) => {
    const response = await fetch(`${API_BASE}/portfolio/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to remove portfolio item');
    return response.json();
  },
};

/**
 * Applications APIs
 */
export const builderApplicationsAPI = {
  // Get all applications
  getApplications: async (accessToken, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE}/applications?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
  },

  // Get single application details
  getApplication: async (applicationId, accessToken) => {
    const response = await fetch(`${API_BASE}/applications/${applicationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch application details');
    return response.json();
  },

  // Apply to a startup
  applyToStartup: async (startupId, applicationData, accessToken) => {
    const response = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startup_id: startupId,
        ...applicationData,
      }),
    });
    if (!response.ok) throw new Error('Failed to submit application');
    return response.json();
  },

  // Withdraw application
  withdrawApplication: async (applicationId, accessToken) => {
    const response = await fetch(`${API_BASE}/applications/${applicationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to withdraw application');
    return response.json();
  },

  // Update application status (admin/startup)
  updateApplicationStatus: async (applicationId, status, accessToken) => {
    const response = await fetch(`${API_BASE}/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update application status');
    return response.json();
  },
};

/**
 * Saved Startups APIs
 */
export const builderSavedStartupsAPI = {
  // Get all saved startups
  getSavedStartups: async (accessToken, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE}/saved-startups?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch saved startups');
    return response.json();
  },

  // Save a startup
  saveStartup: async (startupId, accessToken) => {
    const response = await fetch(`${API_BASE}/saved-startups`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startup_id: startupId }),
    });
    if (!response.ok) throw new Error('Failed to save startup');
    return response.json();
  },

  // Remove saved startup
  unsaveStartup: async (startupId, accessToken) => {
    const response = await fetch(`${API_BASE}/saved-startups/${startupId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to remove saved startup');
    return response.json();
  },

  // Check if startup is saved
  isStartupSaved: async (startupId, accessToken) => {
    const response = await fetch(`${API_BASE}/saved-startups/${startupId}/check`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to check saved status');
    return response.json();
  },
};

/**
 * Tasks APIs
 */
export const builderTasksAPI = {
  // Get active tasks
  getActiveTasks: async (accessToken, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE}/tasks?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  // Get task details
  getTaskDetails: async (taskId, accessToken) => {
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch task details');
    return response.json();
  },

  // Update task progress
  updateTaskProgress: async (taskId, progress, accessToken) => {
    const response = await fetch(`${API_BASE}/tasks/${taskId}/progress`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progress }),
    });
    if (!response.ok) throw new Error('Failed to update task progress');
    return response.json();
  },

  // Submit deliverable
  submitDeliverable: async (taskId, deliverableData, accessToken) => {
    const response = await fetch(`${API_BASE}/tasks/${taskId}/deliverables`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deliverableData),
    });
    if (!response.ok) throw new Error('Failed to submit deliverable');
    return response.json();
  },
};

/**
 * Rewards APIs
 */
export const builderRewardsAPI = {
  // Get rewards summary
  getRewardsSummary: async (accessToken) => {
    const response = await fetch(`${API_BASE}/rewards`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch rewards');
    return response.json();
  },

  // Get earnings history
  getEarningsHistory: async (accessToken, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE}/earnings?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch earnings history');
    return response.json();
  },

  // Get equity holdings
  getEquityHoldings: async (accessToken) => {
    const response = await fetch(`${API_BASE}/equity`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch equity holdings');
    return response.json();
  },

  // Request payout
  requestPayout: async (amount, method, accessToken) => {
    const response = await fetch(`${API_BASE}/payouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, method }),
    });
    if (!response.ok) throw new Error('Failed to request payout');
    return response.json();
  },

  // Get payment methods
  getPaymentMethods: async (accessToken) => {
    const response = await fetch(`${API_BASE}/payment-methods`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch payment methods');
    return response.json();
  },

  // Add payment method
  addPaymentMethod: async (methodData, accessToken) => {
    const response = await fetch(`${API_BASE}/payment-methods`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(methodData),
    });
    if (!response.ok) throw new Error('Failed to add payment method');
    return response.json();
  },
};

/**
 * Discovery APIs
 */
export const builderDiscoveryAPI = {
  // Get recommended startups
  getRecommendedStartups: async (accessToken, limit = 10) => {
    const response = await fetch(`${API_BASE}/recommended-startups?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch recommendations');
    return response.json();
  },

  // Search startups
  searchStartups: async (query, filters = {}, accessToken) => {
    const params = new URLSearchParams({
      q: query,
      ...filters,
    });
    const response = await fetch(`${API_BASE}/startups/search?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to search startups');
    return response.json();
  },
};
