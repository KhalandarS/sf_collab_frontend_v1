import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { notificationService } from "../services/notificationService";
import { getSocketInstance } from "@/utils/getSocketInstance";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, access_token } = useSelector((state) => state.auth);

  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({});


  // -----------------------------
  // SOCKET.IO (backend expects query.user_id)
  // -----------------------------
  useEffect(() => {
    if (!access_token || !user?.id) return;

    const s = getSocketInstance();

    s.on("connect", () => console.log("✅ Socket.IO connected", s.id));
    s.on("disconnect", () => console.log("❌ Socket.IO disconnected"));
    s.on("connect_error", (err) => console.error("Socket.IO connection error:", err?.message || err));

    s.on("new_notification", (data) => {
      const notif = data?.notification ?? data;
      if (!notif) return;

      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // optional toast event
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: {
            type: notif.type,
            title: notif.title,
            message: notif.message,
            data: notif.data,
          },
        })
      );
    });

    s.on("user_status", (data) => console.log("User status update:", data));

    setSocket(s);

    return () => {
      s.close();
      setSocket(null);
    };
  }, [access_token, user?.id]);

  // -----------------------------
  // API LOADERS
  // -----------------------------
  const loadNotifications = useCallback(
  async (pageNum = 1, newFilters = filters) => {
    if (!access_token) return;

    try {
      setLoading(true);

      // ✅ Remove token parameter
      const data = await notificationService.getNotifications({
        page: pageNum,
        per_page: 20,
        ...newFilters,
      });

      const list = data?.notifications ?? [];

      if (pageNum === 1) setNotifications(list);
      else setNotifications((prev) => [...prev, ...list]);

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

const loadUnreadCount = useCallback(async () => {
  if (!access_token) return;
  try {
    // ✅ Remove token parameter
    const data = await notificationService.getUnreadCount();
    setUnreadCount(Number(data?.unread_count ?? 0));
  } catch (err) {
    console.error("Error loading unread count:", err);
  }
}, [access_token]);

// const loadStats = useCallback(async () => {
//   if (!token) return;
//   try {
//     const data = await notificationService.getStats();
//     console.log(data);
//     setStats(data);
//   } catch (err) {
//     console.error("Error loading stats:", err);
//   }
// }, [token]);

  // initial load (and when token changes)

  useEffect(() => {
    if (!access_token) return;
    loadNotifications(1);
    loadUnreadCount();
    // loadStats();
  }, [access_token, loadNotifications, loadUnreadCount]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) loadNotifications(page + 1);
  }, [loading, hasMore, page, loadNotifications]);

  const applyFilters = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      loadNotifications(1, newFilters);
    },
    [loadNotifications]
  );

  const refresh = useCallback(() => {
    loadNotifications(1);
    loadUnreadCount();
  }, [loadNotifications, loadUnreadCount]);

  const value = useMemo(
    () => ({
      // state
      notifications,
      unreadCount,
      stats,
      loading,
      hasMore,
      filters,
      socket,

      // actions
      loadMore,
      applyFilters,
      refresh,
    }),
    [notifications, unreadCount, stats, loading, hasMore, filters, socket, loadMore, applyFilters, refresh]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};



export default NotificationContext;