/**
 * SF Collab Notification Context - FIXED VERSION
 * Provides notification state management and real-time updates
 */

import React, { 
  createContext, 
  useContext, 
  useEffect, 
  useMemo, 
  useState, 
  useCallback 
} from "react";
import { useSelector } from "react-redux";
import { notificationAPI } from "@/utils/APIs/notificationAPI";
import { getSocketInstance } from "@/utils/getSocketInstance";

// Create context
const NotificationContext = createContext(null);

/**
 * Custom hook to use notification context
 */
export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
};

/**
 * Notification Provider Component
 */
export const NotificationProvider = ({ children }) => {
  const { user, access_token } = useSelector((state) => state.auth);

  // State
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({});
  const [isConnected, setIsConnected] = useState(false);

  // -----------------------------
  // SOCKET.IO CONNECTION
  // -----------------------------
  useEffect(() => {
    if (!access_token || !user?.id) return;

    const socketInstance = getSocketInstance();

    socketInstance.on("connect", () => {
      console.log("✅ Socket.IO connected for notifications", socketInstance.id);
      setIsConnected(true);
      
      // Join user room for notifications
      socketInstance.emit("join_notifications", { user_id: user.id });
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket.IO disconnected:", reason);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err?.message || err);
      setIsConnected(false);
    });

    // Handle new notifications
    socketInstance.on("new_notification", (data) => {
      console.log("📬 New notification received:", data);
      const notif = data?.notification ?? data;
      if (!notif) return;

      // Add to notifications list
      setNotifications((prev) => {
        // Avoid duplicates
        if (prev.some(n => n.id === notif.id)) {
          return prev;
        }
        return [notif, ...prev];
      });
      
      // Increment unread count
      setUnreadCount((prev) => prev + 1);

      // Dispatch toast event for ToastNotification component
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: {
            type: notif.type || notif.notification_type || 'info',
            title: notif.title,
            message: notif.message,
            data: notif.data,
          },
        })
      );
    });

    // Handle user status updates
    socketInstance.on("user_status", (data) => {
      console.log("User status update:", data);
    });

    // Handle notification read sync (when marked from another device/tab)
    socketInstance.on("notification_read", (data) => {
      const { notificationId } = data;
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("new_notification");
      socketInstance.off("notification_read");
      socketInstance.off("user_status");
      socketInstance.close();
      setSocket(null);
      setIsConnected(false);
    };
  }, [access_token, user?.id]);

  // -----------------------------
  // API METHODS
  // -----------------------------
  
  /**
   * Load notifications from API
   */
  const loadNotifications = useCallback(
    async (pageNum = 1, newFilters = filters) => {
      if (!access_token) return;

      try {
        setLoading(true);

        const data = await notificationAPI.getAll({
          page: pageNum,
          per_page: 20,
          ...newFilters,
        });

        const list = data?.notifications ?? [];

        if (pageNum === 1) {
          setNotifications(list);
        } else {
          setNotifications((prev) => {
            // Avoid duplicates when loading more
            const existingIds = new Set(prev.map(n => n.id));
            const newItems = list.filter(n => !existingIds.has(n.id));
            return [...prev, ...newItems];
          });
        }

        setPage(pageNum);

        const pagination = data?.pagination;
        if (pagination?.page != null && pagination?.pages != null) {
          setHasMore(pagination.page < pagination.pages);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error loading notifications:", err);
      } finally {
        setLoading(false);
      }
    },
    [access_token, filters]
  );

  /**
   * Load unread count from API
   */
  const loadUnreadCount = useCallback(async () => {
    if (!access_token) return;
    try {
      const data = await notificationAPI.getUnreadCount();
      setUnreadCount(Number(data?.unreadCount ?? data?.unread_count ?? 0));
    } catch (err) {
      console.error("Error loading unread count:", err);
    }
  }, [access_token]);

  /**
   * Load notification stats
   */
  const loadStats = useCallback(async () => {
    if (!access_token) return;
    try {
      const data = await notificationAPI.getStats();
      setStats(data);
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  }, [access_token]);

  /**
   * Mark a notification as read
   */

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );

      // only decrement if it was unread before
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  }, []);

  const markAsUnread = useCallback(async (notificationId) => {
    try {
      await notificationAPI.markAsUnread(notificationId);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: false } : n
        )
      );

      setUnreadCount((prev) => prev + 1);
    } catch (err) {
      console.error("Error marking notification as unread:", err);
    }
  }, []);
  


  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async (category = null) => {
    try {
      await notificationAPI.markAllRead(category);
      
      setNotifications((prev) =>
        prev.map((n) => {
          if (category && n.category !== category) return n;
          return { ...n, is_read: true };
        })
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  }, []);

  /**
   * Delete a notification
   */
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationAPI.delete(notificationId);
      
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      
      if (notification && !notification.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  }, [notifications]);

  /**
   * Delete all read notifications
   */
  const deleteAllRead = useCallback(async () => {
    try {
      await notificationAPI.deleteAllRead();
      setNotifications((prev) => prev.filter((n) => !n.is_read));
    } catch (err) {
      console.error("Error deleting read notifications:", err);
    }
  }, []);

  const copyToNotes = useCallback(async (notification) => {
    try {
      // adjust payload shape to whatever your /notes endpoint expects
      const payload = {
        title: notification?.title || "Notification",
        content: notification?.message || "",
        meta: {
          notification_id: notification?.id,
          category: notification?.category,
          type: notification?.type,
          created_at: notification?.created_at,
          data: notification?.data,
        },
      };

      return await notificationAPI.copyToNotes(payload);
    } catch (err) {
      console.error("Error copying notification to notes:", err);
      throw err;
    }
  }, []);


  // Initial load when authenticated
  useEffect(() => {
    if (!access_token) return;
    loadNotifications(1);
    loadUnreadCount();
  }, [access_token]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Load more notifications (pagination)
   */
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadNotifications(page + 1);
    }
  }, [loading, hasMore, page, loadNotifications]);

  /**
   * Apply filters and reload
   */
  const applyFilters = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      loadNotifications(1, newFilters);
    },
    [loadNotifications]
  );

  /**
   * Refresh all notification data
   */
  const refresh = useCallback(() => {
    loadNotifications(1);
    loadUnreadCount();
  }, [loadNotifications, loadUnreadCount]);

  // Context value
  const value = useMemo(
    () => ({
      // State
      markAsUnread,
      copyToNotes,
      notifications,
      unreadCount,
      stats,
      isLoading: loading,
      hasMore,
      filters,
      socket,
      isConnected,

      // Actions
      loadMore,
      applyFilters,
      refresh,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      deleteAllRead,
      loadStats,
    }),
    [
      notifications,
      unreadCount,
      stats,
      loading,
      hasMore,
      filters,
      socket,
      isConnected,
      loadMore,
      applyFilters,
      refresh,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      deleteAllRead,
      loadStats,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;