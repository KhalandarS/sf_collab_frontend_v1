/**
 * SF Collab Notification API - MERGED (keeps your existing baseURL + auth interceptor UI flow)
 * Adds: unified extractData, categories/priorities constants, more endpoints, and keeps existing ones.
 */

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// =======================
// AUTH INTERCEPTOR (PERMANENT FIX)
// =======================

// Safe JSON parse (returns null if invalid)
const safeParse = (v) => {
  try { return JSON.parse(v); } catch { return null; }
};

// Redux-persist sometimes stores values as "\"token\"" (double-stringified)
const unwrapPersistedString = (v) => {
  if (typeof v !== "string") return v;
  const parsed = safeParse(v);
  return typeof parsed === "string" ? parsed : v;
};

const getTokenFromStorage = () => {
  // 1) Direct keys (many apps store tokens this way)
  const directKeys = ["access_token", "accessToken", "token", "jwt"];
  for (const k of directKeys) {
    const v = localStorage.getItem(k);
    if (v) return unwrapPersistedString(v);
  }

  // 2) persist:auth (your current attempt — but make it robust)
  const rawAuth = localStorage.getItem("persist:auth");
  if (rawAuth) {
    const parsedAuth = safeParse(rawAuth);
    if (parsedAuth && typeof parsedAuth === "object") {
      const candidates = [
        parsedAuth.access_token,
        parsedAuth.accessToken,
        parsedAuth.token,
        parsedAuth.jwt,
        parsedAuth.tokens,           // sometimes tokens is nested
        parsedAuth.auth,             // sometimes auth is nested
      ].filter(Boolean);

      for (const c of candidates) {
        // if nested JSON string
        const maybeObj = typeof c === "string" ? safeParse(c) : c;
        if (typeof maybeObj === "string" && maybeObj) return maybeObj;

        if (maybeObj && typeof maybeObj === "object") {
          const t =
            maybeObj.access_token ||
            maybeObj.accessToken ||
            maybeObj.token ||
            maybeObj.jwt ||
            maybeObj.access;
          if (t) return unwrapPersistedString(t);
        }

        // last fallback
        const t2 = unwrapPersistedString(c);
        if (typeof t2 === "string" && t2) return t2;
      }
    }
  }

  // 3) persist:root (very common with redux-persist)
  const rawRoot = localStorage.getItem("persist:root");
  if (rawRoot) {
    const parsedRoot = safeParse(rawRoot);
    if (parsedRoot && typeof parsedRoot === "object") {
      // try common slice names
      const sliceNames = ["auth", "user", "session"];
      for (const s of sliceNames) {
        if (!parsedRoot[s]) continue;

        const slice = typeof parsedRoot[s] === "string" ? safeParse(parsedRoot[s]) : parsedRoot[s];
        if (!slice || typeof slice !== "object") continue;

        const t =
          slice.access_token ||
          slice.accessToken ||
          slice.token ||
          slice.jwt ||
          (slice.tokens && (slice.tokens.access_token || slice.tokens.accessToken || slice.tokens.token));
        if (t) return unwrapPersistedString(t);
      }
    }
  }

  return null;
};

api.interceptors.request.use((config) => {
  try {
    const token = getTokenFromStorage();

    // IMPORTANT: make sure headers exists
    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error("Auth interceptor error:", e);
  }

  return config;
});




// ==============================
// RESPONSE INTERCEPTOR (kept)
// ==============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// =======================
// HELPERS
// =======================
const extractData = (response) => {
  // Supports:
  // - { data: {...} }
  // - { data: { data: {...} } } (success_response wrapper)
  if (response?.data?.data !== undefined) return response.data.data;
  return response?.data;
};

// =======================
// CONSTANTS (added)
// =======================
export const NOTIFICATION_CATEGORIES = {
  ACCOUNT: "account",
  SOCIAL: "social",
  IDEA: "idea",
  STARTUP: "startup",
  TASK: "task",
  MESSAGE: "message",
  FILE: "file",
  REWARD: "reward",
  GOVERNANCE: "governance",
  FUNDING: "funding",
  AI: "ai",
  EVENT: "event",
  FRIEND: "friend",
  APPLICATION: "application",
  NEWSLETTER: "newsletter", // optional but useful for your UI tab
};

export const NOTIFICATION_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};

// =======================
// API
// =======================
export const notificationAPI = {
  /**
   * Get all notifications with pagination + filters
   * Keeps your old call signature but adds sane defaults.
   */
  getAll: async (params = {}) => {
    const response = await api.get("/notifications", {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 20,
        ...params,
      },
    });
    return extractData(response);
  },

  /**
   * Get notifications by category
   */
  getByCategory: async (category, params = {}) => {
    const response = await api.get("/notifications", {
      params: { category, ...params },
    });
    return extractData(response);
  },

  /**
   * High priority notifications
   * - Prefer your existing endpoint if your backend has it
   * - Fallback to query params if not
   */
  getHighPriority: async (limit = 5) => {
    try {
      // Your current backend route
      const response = await api.get("/notifications/high-priority", {
        params: { limit },
      });
      return extractData(response);
    } catch (err) {
      // Fallback to query filtering
      const response = await api.get("/notifications", {
        params: { priority: "high,critical", is_read: "false", per_page: limit, page: 1 },
      });
      return extractData(response);
    }
  },

  /**
   * Get single notification by ID (added)
   */
  getById: async (notificationId) => {
    const response = await api.get(`/notifications/${notificationId}`);
    return extractData(response);
  },

  /**
   * Create new notification (added)
   */
  create: async (notificationData) => {
    const response = await api.post("/notifications", notificationData);
    return extractData(response);
  },

  /**
   * Unread count (kept + improved)
   */
  getUnreadCount: async () => {
    const response = await api.get("/notifications/unread-count");
    const data = extractData(response) || {};
    return {
      unreadCount: data.unreadCount ?? data.unread_count ?? 0,
      unread_count: data.unread_count ?? data.unreadCount ?? 0,
    };
  },

  /**
   * Unread count for specific user (added)
   */
  getUserUnreadCount: async (userId) => {
    const response = await api.get(`/notifications/user/${userId}/unread-count`);
    const data = extractData(response) || {};
    return {
      userId: data.user_id ?? userId,
      unreadCount: data.unreadCount ?? data.unread_count ?? 0,
      unread_count: data.unread_count ?? data.unreadCount ?? 0,
    };
  },

  /**
   * Mark single notification as read
   * Your two versions use PUT vs POST. Support both safely.
   */
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return extractData(response);
    } catch (err) {
      const response = await api.post(`/notifications/${notificationId}/read`);
      return extractData(response);
    }
  },

  /**
   * Mark single notification as unread
   */
  markAsUnread: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/unread`);
      return extractData(response);
    } catch (err) {
      const response = await api.post(`/notifications/${notificationId}/unread`);
      return extractData(response);
    }
  },

  /**
   * Mark all as read
   * - Your file uses PUT with body {category}
   * - Other file uses POST with params (?category=)
   * Support both.
   */
  markAllRead: async (category = null) => {
    try {
      const response = await api.put("/notifications/mark-all-read", { category });
      return extractData(response);
    } catch (err) {
      const params = category ? { category } : {};
      const response = await api.post("/notifications/mark-all-read", {}, { params });
      return extractData(response);
    }
  },

  /**
   * Batch mark read (added)
   */
  markBatchRead: async (notificationIds) => {
    const response = await api.post("/notifications/batch/read", {
      notification_ids: notificationIds,
    });
    return extractData(response);
  },

  /**
   * Bulk mark read (kept + normalized payload)
   * Your old one sends {notification_ids}; the other sends {notificationIds}.
   * We'll send both to be compatible.
   */
  bulkMarkRead: async (notificationIds) => {
    try {
      const response = await api.put("/notifications/bulk/mark-read", {
        notification_ids: notificationIds,
        notificationIds,
      });
      return extractData(response);
    } catch (err) {
      const response = await api.post("/notifications/bulk/mark-read", {
        notification_ids: notificationIds,
        notificationIds,
      });
      return extractData(response);
    }
  },

  /**
   * Delete single notification (kept)
   */
  delete: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return extractData(response);
  },

  /**
   * Delete all read
   * Your old endpoint: DELETE /notifications/read
   * Other endpoint: DELETE /notifications/delete-all-read
   * Support both.
   */
  deleteAllRead: async () => {
    try {
      const response = await api.delete("/notifications/delete-all-read");
      return extractData(response);
    } catch (err) {
      const response = await api.delete("/notifications/read");
      return extractData(response);
    }
  },

  /**
   * Clear all notifications
   * Your old endpoint: DELETE /notifications/all
   * If your backend has a different one, you can add here.
   */
  clearAll: async () => {
    const response = await api.delete("/notifications/all");
    return extractData(response);
  },

  /**
   * Bulk delete
   * Your old: DELETE /notifications/bulk with body { notification_ids }
   * Other: POST /notifications/bulk/delete with { notificationIds }
   * Support both.
   */
  bulkDelete: async (notificationIds) => {
    try {
      const response = await api.delete("/notifications/bulk", {
        data: { notification_ids: notificationIds, notificationIds },
      });
      return extractData(response);
    } catch (err) {
      const response = await api.post("/notifications/bulk/delete", {
        notificationIds,
        notification_ids: notificationIds,
      });
      return extractData(response);
    }
  },

  /**
   * Stats (kept + wrapper-safe)
   */
  getStats: async () => {
    const response = await api.get("/notifications/stats");
    const data = extractData(response) || {};
    return data.stats ?? data;
  },

  /**
   * Preferences (kept + wrapper-safe)
   */
  getPreferences: async () => {
    const response = await api.get("/notifications/preferences");
    const data = extractData(response) || {};
    return data.preferences ?? data;
  },

  /**
   * Update preferences (kept)
   */
  updatePreferences: async (preferences) => {
    const response = await api.put("/notifications/preferences", preferences);
    return extractData(response);
  },

  /**
   * Copy notification to Notes (kept)
   */
  copyToNotes: async (noteData) => {
    const response = await api.post("/notes", noteData);
    return extractData(response);
  },
};

export default notificationAPI;
