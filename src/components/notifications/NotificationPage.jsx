
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  RefreshCw,
  Settings,
  Wifi,
  WifiOff,
  Loader2,
  AlertCircle,
  Newspaper,
  Inbox,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import NotificationItem from "./NotificationItem";
import { useNotifications } from "@/contexts/NotificationContext";

export default function NotificationPage() {
  const ctx = useNotifications();

  // Keep compatibility with either naming style
  const notifications = ctx.notifications || [];
  const unreadCount = ctx.unreadCount ?? 0;
  const loading = ctx.loading ?? ctx.isLoading ?? false;
  const hasMore = ctx.hasMore ?? false;
  const isConnected = ctx.isConnected ?? true;

  const refresh = ctx.refresh || (async () => {});
  const loadMore = ctx.loadMore || (async () => {});
  const applyFilters = ctx.applyFilters || (() => {});
  const markAllAsRead = ctx.markAllAsRead || (async () => {});
  const deleteAllRead = ctx.deleteAllRead || (async () => {});

  // Optional actions (may not exist in your context)
  const clearAllNotifications = ctx.clearAllNotifications; // optional
  const error = ctx.error; // optional

  const [activeFilter, setActiveFilter] = useState("general");
  const [isClearing, setIsClearing] = useState(false);

  // Filter definitions (includes General + Newsletter)
  const filters = useMemo(
    () => [
      { id: "general", label: "General", icon: null, filter: { category: "general" } },
      { id: "newsletter", label: "Newsletter", icon: null, filter: { category: "newsletter" } },

      // Existing filters preserved
      { id: "all", label: "All", icon: null, filter: {} },
      { id: "unread", label: "Unread", icon: null, filter: { is_read: "false" } },
      { id: "success", label: "Success", icon: null, filter: { type: "success" } },
      { id: "info", label: "Info", icon: null, filter: { type: "info" } },
      { id: "warning", label: "Warnings", icon: null, filter: { type: "warning" } },
      { id: "error", label: "Errors", icon: null, filter: { type: "error" } },
    ],
    []
  );

  // Local filtering (so UI works even if applyFilters is a no-op / backend not filtering)
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

    switch (activeFilter) {
      case "general":
        // General = everything except newsletter category
        filtered = notifications.filter((n) => n.category !== "newsletter");
        break;
      case "newsletter":
        filtered = notifications.filter((n) => n.category === "newsletter");
        break;
      case "unread":
        filtered = notifications.filter((n) => !n.is_read);
        break;
      case "success":
        filtered = notifications.filter((n) => n.type === "success");
        break;
      case "info":
        filtered = notifications.filter((n) => n.type === "info");
        break;
      case "warning":
        filtered = notifications.filter((n) => n.type === "warning");
        break;
      case "error":
        filtered = notifications.filter((n) => n.type === "error");
        break;
      case "all":
      default:
        break;
    }

    return filtered;
  }, [notifications, activeFilter]);

  // Handle filter change
  const handleFilterChange = useCallback(
    (f) => {
      setActiveFilter(f.id);

      // Keep calling applyFilters (if your context uses server-side filtering)
      // But our UI list is still driven by filteredNotifications above, so UI remains consistent.
      if (typeof applyFilters === "function") {
        if (f.id === "general") {
          // no direct backend equivalent usually; still pass something harmless
           applyFilters({});
        } else if (f.id === "newsletter") {
          applyFilters({ category: "newsletter" });
        } else {
          applyFilters(f.filter || {});
        }
      }
    },
    [applyFilters]
  );

  // Handle mark all as read
  const handleMarkAllRead = useCallback(async () => {
    await markAllAsRead();
    refresh();
  }, [markAllAsRead, refresh]);

  // Handle delete all read
  const handleDeleteAllRead = useCallback(async () => {
    await deleteAllRead();
    refresh();
  }, [deleteAllRead, refresh]);

  // Optional: clear all
  const handleClearAll = useCallback(async () => {
    if (!clearAllNotifications) return;

    if (window.confirm("Clear ALL notifications? This will permanently delete all your notifications and cannot be undone.")) {
      setIsClearing(true);
      try {
        await clearAllNotifications();
        refresh();
      } finally {
        setIsClearing(false);
      }
    }
  }, [clearAllNotifications, refresh]);

  // Handle notification read (called when notification becomes visible)
  const handleNotificationRead = useCallback((notification) => {
    // marking is handled in NotificationItem (unchanged)
  }, []);

  // Handle notification delete
  const handleNotificationDelete = useCallback(() => {
    refresh();
  }, [refresh]);

  // Default filter on mount (to match first file behavior)
  useEffect(() => {
    const f = filters.find((x) => x.id === "general") || filters[0];
    handleFilterChange(f);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 px-4 py-6">
      {/* ================= HEADER ================= */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-gray-800 border border-gray-700 p-6"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-5 h-5 text-blue-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Notifications
              </h1>

              {/* Connection status indicator */}
              <div className="flex items-center gap-1 ml-2">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400">Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">Offline</span>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-400">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "You're all caught up"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <HeaderButton icon={RefreshCw} onClick={refresh} loading={loading}>
              Refresh
            </HeaderButton>

            <HeaderButton
              icon={Settings}
              onClick={() => (window.location.href = "/user-profile?page=notifications")}
            >
              Settings
            </HeaderButton>

            {notifications.length > 0 && (
              <>
                <HeaderButton
                  icon={CheckCheck}
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0}
                >
                  Mark all read
                </HeaderButton>

                <HeaderButton danger icon={Trash2} onClick={handleDeleteAllRead}>
                  Delete all read
                </HeaderButton>

                {/* Clear all (only if your context supports it) */}
                {typeof clearAllNotifications === "function" && (
                  <HeaderButton
                    danger
                    icon={isClearing ? Loader2 : AlertCircle}
                    onClick={handleClearAll}
                    loading={isClearing}
                  >
                    Clear all
                  </HeaderButton>
                )}
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Optional error message (UI kept simple and consistent) */}
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* ================= FILTERS ================= */}
      <motion.section
        layout
        className="rounded-xl bg-white/[0.03] border border-white/10 p-4 flex gap-2 overflow-x-auto"
      >
        {filters.map((f) => {
          const Icon = f.icon;
          return (
            <motion.button
              key={f.id}
              layout
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleFilterChange(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap flex items-center gap-2
                ${
                  activeFilter === f.id
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
            >
              {Icon ? <Icon className="w-4 h-4" /> : null}
              {f.label}
              {f.id === "unread" && unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-indigo-500 text-white">
                  {unreadCount}
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.section>

      {/* ================= CONTENT ================= */}
      <section className="space-y-3">
        <AnimatePresence mode="popLayout">
          {/* Loading state */}
          {loading && notifications.length === 0 && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingState />
            </motion.div>
          )}

          {/* Empty state */}
          {!loading && filteredNotifications.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                label={
                  activeFilter === "newsletter"
                    ? "No newsletter notifications"
                    : activeFilter === "unread"
                    ? "No unread notifications"
                    : "No notifications found"
                }
              />
            </motion.div>
          )}

          {/* Notification items */}
          {filteredNotifications.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="cursor-pointer"
              onClick={() => {
                if (n.linkUrl) window.location.href = n.linkUrl;
              }}
            >
              <NotificationItem
                notification={n}
                onMarkAsRead={handleNotificationRead}
                onDelete={handleNotificationDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      {/* ================= LOAD MORE ================= */}
      {hasMore && activeFilter === "all" && (
        <div className="flex justify-center pt-6">
          <motion.button
            onClick={loadMore}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:border-indigo-500/40 transition disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load more notifications"}
          </motion.button>
        </div>
      )}
    </div>
  );
}

/* ================= SUBCOMPONENTS ================= */

function HeaderButton({ icon: Icon, danger, loading, disabled, onClick, children }) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
        ${
          danger
            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
            : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <Icon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
      {children}
    </motion.button>
  );
}

function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-white/40">
      <Bell className="w-12 h-12 mb-4 opacity-50" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-white/40">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mb-4" />
      <p className="text-sm">Loading notifications…</p>
    </div>
  );
}
