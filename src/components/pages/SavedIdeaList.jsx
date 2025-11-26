import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Filter,
  Search,
  Clock,
  User,
  MessageSquare,
  TrendingUp,
  Building2,
  BookmarkMinus,
} from "lucide-react";
import SavedHeader from "./SavedHeader";
import { Link } from "react-router-dom";

const SavedList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  const menuButtonRefs = useRef({});
  const menuDropdownRefs = useRef({});
  const headerSettingsRef = useRef(null);

  const [settings, setSettings] = useState({
    playSoundOnNew: true,
    enableDesktop: false,
    autoArchiveRead: false,
    confirmBeforeClear: true,
  });

  // Fetch bookmarks from authenticated endpoints
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found");
          setLoading(false);
          return;
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [ideationRes, startupRes, knowledgeRes] = await Promise.all([
          fetch("https://sfcolab-backend.onrender.com/api/ideation/bookmarks", { headers }),
          fetch("https://sfcolab-backend.onrender.com/api/startup/bookmarks", { headers }),
          fetch("https://sfcolab-backend.onrender.com/api/knowledge/bookmarks", { headers }),
        ]);

        const [ideationData, startupData, knowledgeData] = await Promise.all([
          ideationRes.json(),
          startupRes.json(),
          knowledgeRes.json(),
        ]);

        // Map bookmarks into unified format
        const mapped = [
          ...(ideationData.bookmarks || []).map((item) => ({
            ...item,
            type: "idea",
            category: "Ideas",
            url: item.url,
          })),
          ...(startupData.bookmarks || []).map((item) => ({
            ...item,
            type: "startup",
            category: "Start-Ups",
            url: item.url,
          })),
          ...(knowledgeData.bookmarks || []).map((item) => ({
            ...item,
            type: "post",
            category: "Posts",
            url: item.url,
          })),
        ];

        setNotifications(mapped);
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "idea":
        return <TrendingUp className="h-5 w-5 text-purple-400" />;
      case "startup":
        return <Building2 className="h-5 w-5 text-blue-400" />;
      case "post":
        return <MessageSquare className="h-5 w-5 text-green-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "idea":
        return "border-l-purple-500 bg-purple-500/5";
      case "startup":
        return "border-l-blue-500 bg-blue-500/5";
      case "post":
        return "border-l-green-500 bg-green-500/5";
      default:
        return "border-l-gray-500 bg-gray-500/5";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Start-Ups":
        return <Building2 className="h-4 w-4" />;
      case "Ideas":
        return <TrendingUp className="h-4 w-4" />;
      case "Posts":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      searchQuery === "" ||
      notification.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.sender?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" || (activeTab === "unread" && !notification.read);

    const matchesFilter =
      selectedFilter === "all" || notification.category === selectedFilter;

    return matchesSearch && matchesTab && matchesFilter;
  });

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification._id !== id));
  };

  return (
    <div className="w-full p-4 px-2 max-sm:px-0 space-y-6">
      <SavedHeader
        settings={settings}
        setSettings={setSettings}
        showSettings={showSettingsPanel}
        setShowSettings={setShowSettingsPanel}
        headerSettingsRef={headerSettingsRef}
        disabledArchiveAction={filteredNotifications.length === 0}
      />

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookmarks..."
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

      {/* Filter Options */}
      {showFilters && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {["all", "Ideas", "Start-Ups", "Posts"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedFilter === filter
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 hover:bg-white/20 text-gray-300"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bookmarks List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading bookmarks...</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <BookmarkMinus className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">
            {searchQuery || selectedFilter !== "all" ? "No bookmarks found" : "All caught up!"}
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
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Link
              key={notification._id}
              to={notification.url}
              className={`group block p-4 rounded-xl border-l-4 transition-all duration-200 hover:bg-white/5 ${getNotificationColor(
                notification.type
              )}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-white max-sm:text-sm">{notification.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      {getCategoryIcon(notification.category)}
                      <span>{notification.category}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-2 line-clamp-2 max-sm:text-xs">
                    {notification.contentPreview}
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedList;
