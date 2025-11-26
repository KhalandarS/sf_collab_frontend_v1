import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Bell,
  BellOff,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Filter,
  Search,
  Clock,
  User,
  MessageSquare,
  TrendingUp,
  Building2,
  Settings,
  MoreVertical,
} from "lucide-react";
import NotificationsHeader from "../headers/NotificationsHeader";

const BASE_URL = "https://sfcolab-backend.onrender.com";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    confirmBeforeClear: true,
  });
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuButtonRefs = useRef({});
  const menuDropdownRefs = useRef({});
  const headerSettingsRef = useRef(null);

  // Fetch notifications
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data.notifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Close menus/settings on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuId !== null) {
        const btn = menuButtonRefs.current[openMenuId];
        const dd = menuDropdownRefs.current[openMenuId];
        if (btn && !btn.contains(e.target) && dd && !dd.contains(e.target))
          setOpenMenuId(null);
      }
      if (
        showSettingsPanel &&
        headerSettingsRef.current &&
        !headerSettingsRef.current.contains(e.target)
      ) {
        setShowSettingsPanel(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpenMenuId(null);
        setShowSettingsPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenuId, showSettingsPanel]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "border-l-green-500 bg-green-500/5";
      case "warning":
        return "border-l-yellow-500 bg-yellow-500/5";
      case "info":
        return "border-l-blue-500 bg-blue-500/5";
      default:
        return "border-l-gray-500 bg-gray-500/5";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "project":
        return <Building2 className="h-4 w-4" />;
      case "deadline":
        return <Clock className="h-4 w-4" />;
      case "team":
        return <User className="h-4 w-4" />;
      case "ideation":
        return <TrendingUp className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Filters
  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      searchQuery === "" ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.sender && n.sender.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      selectedFilter === "all" || n.category === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(
    (n) => !n.read && !n.archived
  ).length;
  const totalCount = notifications.filter((n) => !n.archived).length;
  const archivedCount = notifications.filter((n) => n.archived).length;

  // Actions
  const handleMarkAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  const handleMarkAsUnread = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: false } : n))
    );
  const handleArchive = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, archived: true } : n))
    );
  const handleUnarchive = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, archived: false } : n))
    );
  const handleDelete = (id) =>
    setNotifications((prev) => prev.filter((n) => n._id !== id));

  const handleMarkAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const handleArchiveAll = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, archived: true })));

  if (loading)
    return (
      <div className="text-center py-12 text-gray-400">
        Loading notifications...
      </div>
    );

  return (
    <div className="w-full p-4 px-2 max-sm:px-0 space-y-6">
      {/* Header */}
      <NotificationsHeader
        unreadCount={unreadCount}
        onDismissAll={handleMarkAllAsRead}
        onRefresh={() => {}}
        settings={settings}
        setSettings={setSettings}
        showSettings={showSettingsPanel}
        setShowSettings={setShowSettingsPanel}
        isArchivedTab={activeTab === "archived"}
        disabledArchiveAction={filteredNotifications.length === 0}
        onArchiveVisible={handleArchiveAll}
        onUnarchiveVisible={() => {}}
        headerSettingsRef={headerSettingsRef}
      />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications..."
            className="w-full px-4 py-2.5 pl-12 bg-white/10 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-200"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 text-gray-400" />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 border border-white/10 hover:border-white/20"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {[
              "all",
            //   "project",
            //   "deadline",
            //   "team",
            //   "ideation",
            //   "system",
            //   "message",
            ].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedFilter === f
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 hover:bg-white/20 text-gray-300"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap border-b border-white/10 gap-x-0 overflow-x-auto">
        {[
          { key: "all", label: "All", count: totalCount },
        //   { key: "unread", label: "Unread", count: unreadCount },
        //   { key: "archived", label: "Archived", count: archivedCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-xs font-medium transition-all duration-200 relative ${
              activeTab === tab.key
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-white/10 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <BellOff className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              {searchQuery || selectedFilter !== "all"
                ? "No notifications found"
                : "All caught up!"}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery || selectedFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You're all caught up! Check back later for updates."}
            </p>
            {(searchQuery || selectedFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("all");
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`group p-4 rounded-xl border-l-4 transition-all duration-200 hover:bg-white/5 ${getNotificationColor(
                notification.type
              )} ${!notification.read ? "bg-white/10" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div>{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-white max-sm:text-sm">
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          {getCategoryIcon(notification.category)}
                          <span>{notification.category}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-2 line-clamp-2 max-sm:text-xs">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{notification.sender}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
