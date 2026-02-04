import {  useEffect, useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  RefreshCw,
  Settings,
  Filter,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import NotificationItem from "./NotificationItem";
import useNotifications from "@/contexts/useNotifications";
import { notificationAPI } from "@/utils/APIs/notificationAPI";

export default function NotificationPage() {
  const {
    notifications,
    unreadCount,
    loading,
    hasMore,
    loadMore,
    applyFilters,
    refresh,
  } = useNotifications();
  const markAllAsRead = async () => {
    await notificationAPI.markAllRead();
    refresh();
  }
  const [notificationsRead, setNotificationsRead] = useState([]);
  const onMarkAsRead = (id) => {
    setNotificationsRead((prev) => [...prev, id]);
  }
  useEffect(() => {
    async function markReadBatch() {
      if (notificationsRead.length > 5) {
        await notificationAPI.markBatchRead(notificationsRead.map((n) => n.id));
        refresh();
        setNotificationsRead([]);
      }
    }
    markReadBatch();
  }, [notificationsRead, refresh]);
  const [activeFilter, setActiveFilter] = useState("all");
  const filters = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread", filter: { is_read: false } },
    { id: "success", label: "Success", filter: { type: "success" } },
    { id: "info", label: "Info", filter: { type: "info" } },
    { id: "warning", label: "Warnings", filter: { type: "warning" } },
    { id: "error", label: "Errors", filter: { type: "error" } },
  ];

  const applyFilter = (f) => {
    setActiveFilter(f.id);
    applyFilters(f.filter || {});
  };

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
            </div>
            <p className="text-sm text-gray-400">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notifications`
                : "You're all caught up"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <HeaderButton icon={RefreshCw} onClick={refresh}>
              Refresh
            </HeaderButton>
            <HeaderButton icon={Settings} onClick={() => window.location.href = "/user-profile?page=notifications"}>
              Settings
            </HeaderButton>
            {
              notifications.length > 0 &&
            <>
            <HeaderButton icon={CheckCheck} onClick={markAllAsRead}>
              Mark all read
            </HeaderButton>

            

            <HeaderButton 
              danger 
              icon={Trash2} 
              onClick={async () => {
                await notificationAPI.deleteAllRead();
                refresh();
              }}
            >
              Delete all read
            </HeaderButton>
              </>
            }
          </div>
        </div>
      </motion.header>

      {/* ================= FILTERS ================= */}
      <motion.section
        layout
        className="rounded-xl bg-white/[0.03] border border-white/10 p-4 flex gap-2 overflow-x-auto"
      >
        {filters.map((f) => (
          <motion.button
            key={f.id}
            layout
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => applyFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap
              ${
                activeFilter === f.id
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
          >
            {f.label}
            {f.id === "unread" && unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-indigo-500 text-white">
                {unreadCount}
              </span>
            )}
          </motion.button>
        ))}
      </motion.section>

      {/* ================= CONTENT ================= */}
      <section className="space-y-3">
        <AnimatePresence mode="popLayout">
          {loading && notifications.length === 0 && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState label="Loading notifications…" />
            </motion.div>
          )}

          {!loading && notifications.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState label="No notifications found" />
            </motion.div>
          )}

          {notifications.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <NotificationItem notification={n} onMarkAsRead={onMarkAsRead} onDelete={() => refresh()} />
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      {/* ================= LOAD MORE ================= */}
      {hasMore && (
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

function HeaderButton({ icon: Icon, danger, as = "button", ...props }) {
  const Comp = motion[as] || motion.button;

  return (
    <Comp
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
        ${
          danger
            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
            : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
        }`}
    >
      <Icon className="w-4 h-4" />
      {props.children}
    </Comp>
  );
}

function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-white/40">
      <Filter className="w-8 h-8 mb-2" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
