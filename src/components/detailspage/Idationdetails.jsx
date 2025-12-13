import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Heart,
  Users,
  Clock,
  Send,
  Bookmark,
  Share2,
  Tag,
  X,
  Trash2,
  Edit2,
  Eye,
  Zap,
  Sparkles,
  Building2,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Mail,
  ExternalLink,
  Code,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ShinyText from "../ui/ShinyText";

// API Configuration
const BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api/ideas"
    : "https://sfcolab-backend.onrender.com/api/ideation";

const IdeationDetails = () => {
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [bookmarkNotification, setBookmarkNotification] = useState("");
  const [showShareMsg, setShowShareMsg] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinPosition, setJoinPosition] = useState("");
  const [joinSkills, setJoinSkills] = useState("");
  const [suggestMessage, setSuggestMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const commentInputRef = useRef(null);
  const discussionSectionRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const ideaId = queryParams.get("id")?.toString();

  // Get current user ID
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(decoded?.userId || decoded?.id || null);
      } catch (e) {
        console.error("Token decode error:", e);
      }
    }
  }, []);

  // Fetch idea data
  useEffect(() => {
    const fetchIdea = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/${ideaId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch idea");
        }

        const data = await response.json();
        
        // Handle different response structures
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const ideaData = isLocal 
          ? (data.data?.idea || data.idea)
          : (data.idea || data.data?.idea);
        
        if (!ideaData) {
          throw new Error("Idea not found");
        }
        
        setIdea(ideaData);
        setLikes(ideaData.likes || 0);
        setLiked(ideaData.likedByUser || false);
      } catch (error) {
        console.error("Error fetching idea:", error);
        setIdea(null);
      } finally {
        setLoading(false);
      }
    };

    if (ideaId) fetchIdea();
  }, [ideaId]);

  // Fetch bookmarks
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await fetch(`${BASE_URL}/bookmarks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch bookmarks");
        const data = await response.json();

        let bookmarkArray = [];
        if (Array.isArray(data.bookmarks)) {
          bookmarkArray = data.bookmarks;
        } else if (data.bookmarks?.ideas) {
          bookmarkArray = data.bookmarks.ideas;
        }

        const bookmarkSet = new Set(
          bookmarkArray.map((b) => b.ideaId?.toString())
        );

        setBookmarks(bookmarkSet);
      } catch (error) {
        console.error("Bookmarks fetch error:", error);
      }
    };

    fetchBookmarks();
  }, []);

  const isBookmarked = ideaId && bookmarks.has(ideaId);

  // Handle like
  const handleLike = async (e) => {
    e?.stopPropagation();
    
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to like this idea");
      return;
    }

    try {
      // Optimistic update
      const newLiked = !liked;
      setLiked(newLiked);
      setLikes(prev => newLiked ? prev + 1 : prev - 1);

      const response = await fetch(`${BASE_URL}/${ideaId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to like idea");
    } catch (error) {
      console.error("Error liking idea:", error);
      // Revert optimistic update
      setLiked(!liked);
      setLikes(prev => liked ? prev - 1 : prev + 1);
    }
  };

  // Handle bookmark
  const handleBookmark = async (e) => {
    e?.stopPropagation();

    if (!ideaId) {
      setBookmarkNotification("No idea selected");
      setTimeout(() => setBookmarkNotification(""), 2000);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setBookmarkNotification("Please log in to bookmark");
      setTimeout(() => setBookmarkNotification(""), 2000);
      return;
    }

    const newBookmarked = !isBookmarked;
    setBookmarks(prev => {
      const newSet = new Set(prev);
      if (newBookmarked) {
        newSet.add(ideaId);
        setBookmarkNotification("Idea bookmarked!");
      } else {
        newSet.delete(ideaId);
        setBookmarkNotification("Bookmark removed");
      }
      setTimeout(() => setBookmarkNotification(""), 2000);
      return newSet;
    });

    try {
      const response = await fetch(`${BASE_URL}/${ideaId}/bookmark`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to toggle bookmark");
    } catch (error) {
      console.error("Bookmark error:", error);
      // Revert optimistic update
      setBookmarks(prev => {
        const newSet = new Set(prev);
        if (newBookmarked) newSet.delete(ideaId);
        else newSet.add(ideaId);
        return newSet;
      });
    }
  };

  // Handle share
  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/ideation-details?id=${ideaId}`;
      const shareData = {
        title: idea?.title,
        text: `Check out this idea: ${idea?.title}`,
        url: url,
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setShowShareMsg(true);
        setTimeout(() => setShowShareMsg(false), 1500);
      }
    } catch (error) {
      console.error("Share error:", error);
      setShowShareMsg(true);
      setTimeout(() => setShowShareMsg(false), 1500);
    }
  };

  // Handle join team
  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in to join the team");
        return;
      }

      if (!joinName.trim() || !joinPosition.trim()) {
        alert("Please fill in name and position");
        return;
      }

      const response = await fetch(`${BASE_URL}/${ideaId}/team-members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: joinName,
          position: joinPosition,
          skills: joinSkills || "",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to join team");
      }

      // Refresh idea data
      const res = await fetch(`${BASE_URL}/${ideaId}`);
      const ideaData = await res.json();
      const updatedIdea = ideaData.data?.idea || ideaData.idea;
      if (updatedIdea) setIdea(updatedIdea);

      setSuccessMsg("Successfully joined the team!");
      setJoinMessage("");
      setJoinName("");
      setJoinPosition("");
      setJoinSkills("");
      
      setTimeout(() => {
        setShowJoinModal(false);
        setSuccessMsg("");
      }, 1500);
    } catch (err) {
      console.error("Error joining team:", err);
      alert(err.message || "Failed to join team. Please try again.");
    }
  };

  // Handle comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to comment");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/${ideaId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) throw new Error("Failed to post comment");
      const data = await response.json();

      setIdea(prev => ({
        ...prev,
        comments: [data.comment, ...(prev.comments || [])],
      }));
      setComment("");
    } catch (err) {
      console.error("Comment error:", err);
      alert("Failed to post comment");
    }
  };

  // Handle delete
  const handleDeleteIdea = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in to delete this idea");
        return;
      }

      const response = await fetch(`${BASE_URL}/${ideaId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete idea");
      
      const data = await response.json();
      if (data.success) {
        setShowDeleteModal(false);
        setSuccessMsg("Idea deleted successfully");
        setTimeout(() => navigate("/ideation"), 1500);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete idea. Please try again.");
      setShowDeleteModal(false);
    }
  };

  const isCreator = currentUserId && idea?.creator?.id && currentUserId === idea.creator.id;

  const getStageColor = (stage) => {
    const colors = {
      "Idea Stage": "bg-blue-500/10 text-blue-400 border-blue-500/20",
      "Concept Stage": "bg-amber-500/10 text-amber-400 border-amber-500/20",
      "Development Stage": "bg-green-500/10 text-green-400 border-green-500/20",
      "Research Stage": "bg-purple-500/10 text-purple-400 border-purple-500/20",
      "MVP Stage": "bg-red-500/10 text-red-400 border-red-500/20",
      "Growth Stage": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      "Scale Stage": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    };
    return colors[stage] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading idea details...</p>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Idea Not Found</h2>
          <p className="text-gray-400 mb-6">The idea you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/ideation"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Ideas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/ideation"
              className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="font-medium">Back to Ideas</span>
            </Link>

            <div className="flex items-center gap-3">
              {/* Stats Bar */}
              <div className="hidden md:flex items-center gap-6 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <span className="flex items-center gap-2 text-sm">
                  <Heart className={`w-4 h-4 ${liked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                  <span className="font-medium">{likes}</span>
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-400">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium">{idea.comments?.length || 0}</span>
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{idea.teamMembers?.length || 0}</span>
                </span>
              </div>

              {/* Action Buttons */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={`p-3 rounded-xl border transition-all ${liked
                  ? 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30 text-red-400'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBookmark}
                className={`p-3 rounded-xl border transition-all ${isBookmarked
                  ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </motion.button>

              {isCreator && (
                <>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteModal(true)}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Idea Header Card */}
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStageColor(idea.stage)}`}>
                      {idea.stage}
                    </span>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {idea.industry || "Technology"}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    {idea.title}
                  </h1>
                  
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {idea.description}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {idea.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {idea.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-300 text-sm rounded-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 pt-6 border-t border-gray-800">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(idea.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {idea.views || 0} views
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {idea.timeAgo || calculateTimeAgo(idea.createdAt)}
                </span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowJoinModal(true)}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20"
              >
                <Users className="w-5 h-5" />
                Join Project Team
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  discussionSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  setTimeout(() => commentInputRef.current?.focus(), 400);
                }}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Start Discussion
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSuggestModal(true)}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Suggest Improvement
              </motion.button>
            </div>

            {/* Project Details */}
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                  <Tag className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Project Details</h2>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-line leading-relaxed text-lg">
                  {idea.projectDetails || "No additional details provided."}
                </p>
              </div>
            </div>

            {/* Discussion Section */}
            <div 
              ref={discussionSectionRef}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Discussion ({idea.comments?.length || 0})
                  </h2>
                </div>
                <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                  Sort by: Latest
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-6 mb-8">
                {idea.comments?.length > 0 ? (
                  idea.comments.map((comment) => (
                    <motion.div
                      key={comment._id || comment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5"
                    >
                      <img
                        src={comment.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.id}`}
                        alt={comment.author?.firstName}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-white">
                            {comment.author?.firstName} {comment.author?.lastName}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300">{comment.content}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-400 mb-2">No comments yet</h3>
                    <p className="text-gray-500">Be the first to start the discussion!</p>
                  </div>
                )}
              </div>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <textarea
                  ref={commentInputRef}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts... What do you think about this idea?"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!comment.trim()}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20"
                  >
                    <Send className="w-4 h-4" />
                    Post Comment
                  </motion.button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Creator Card */}
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-400" />
                </div>
                Idea Creator
              </h2>
              
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={idea.creator?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${idea.creator?.id}`}
                  alt={idea.creator?.firstName}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-blue-500/30"
                />
                <div>
                  <h3 className="font-semibold text-white">
                    {idea.creator?.firstName} {idea.creator?.lastName}
                  </h3>
                  <p className="text-sm text-gray-400">{idea.creator?.position || "Innovator"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-full">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{idea.creator?.email || "contact@example.com"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>{idea.creator?.ideasCount || 5} ideas shared</span>
                </div>
              </div>
            </div>

            {/* Team Card */}
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-green-400" />
                  </div>
                  Team ({idea.teamMembers?.length || 0})
                </h2>
                <span className="text-sm text-blue-400 cursor-pointer hover:text-blue-300" onClick={() => setShowJoinModal(true)}>
                  + Join
                </span>
              </div>
              
              <div className="space-y-4">
                {idea.teamMembers?.length > 0 ? (
                  idea.teamMembers.map((member, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="font-semibold text-white">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{member.name}</h3>
                        <p className="text-xs text-gray-400">{member.position}</p>
                        {member.skills && (
                          <p className="text-xs text-blue-400 mt-1">{member.skills}</p>
                        )}
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    <p className="text-gray-400 text-sm">No team members yet</p>
                    <button 
                      onClick={() => setShowJoinModal(true)}
                      className="mt-3 text-sm text-blue-400 hover:text-blue-300"
                    >
                      Be the first to join
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Idea Stats</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Engagement Score</span>
                  <span className="text-xl font-bold text-white">87%</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Likes</span>
                    <span className="text-white">{likes}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(likes / 100) * 100}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Comments</span>
                    <span className="text-white">{idea.comments?.length || 0}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((idea.comments?.length || 0) / 50) * 100}%` }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Team Size</span>
                    <span className="text-white">{idea.teamMembers?.length || 0}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((idea.teamMembers?.length || 0) / 10) * 100}%` }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Join Team Modal */}
        {showJoinModal && (
          <Modal onClose={() => setShowJoinModal(false)}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Join Project Team</h2>
              <p className="text-gray-400">Help bring this idea to life with your skills</p>
            </div>
            
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <input
                type="text"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                placeholder="Your Name *"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                value={joinPosition}
                onChange={(e) => setJoinPosition(e.target.value)}
                placeholder="Position/Role *"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                value={joinSkills}
                onChange={(e) => setJoinSkills(e.target.value)}
                placeholder="Skills (e.g., Python, React, AWS)"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                placeholder="Why do you want to join this project? (optional)"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20"
                >
                  Join Team
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Suggest Improvement Modal */}
        {showSuggestModal && (
          <Modal onClose={() => setShowSuggestModal(false)}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Suggest Improvement</h2>
              <p className="text-gray-400">Share your ideas to make this project even better</p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              setSuccessMsg("Thank you for your suggestion!");
              setSuggestMessage("");
              setTimeout(() => {
                setShowSuggestModal(false);
                setSuccessMsg("");
              }, 1500);
            }} className="space-y-4">
              <textarea
                value={suggestMessage}
                onChange={(e) => setSuggestMessage(e.target.value)}
                placeholder="What suggestions do you have? How can this idea be improved?"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={5}
                required
              />
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSuggestModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/20"
                >
                  Submit Suggestion
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <Modal onClose={() => setShowDeleteModal(false)}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Delete Idea</h2>
              <p className="text-gray-400">
                Are you sure you want to delete "{idea.title}"? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteIdea}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium shadow-lg shadow-red-500/20"
              >
                Delete Idea
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {bookmarkNotification && (
          <Notification type="success" message={bookmarkNotification} />
        )}
        
        {showShareMsg && (
          <Notification type="success" message="Link copied to clipboard!" />
        )}
        
        {successMsg && (
          <Notification type="success" message={successMsg} />
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper Components
const Modal = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl p-8 w-full max-w-md"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
      >
        <X className="w-5 h-5 text-gray-400" />
      </button>
      {children}
    </motion.div>
  </motion.div>
);

const Notification = ({ type = "success", message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className={`fixed bottom-4 right-4 px-6 py-3 rounded-xl font-medium shadow-lg z-50 ${
      type === "success"
        ? "bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white border border-green-500/20"
        : "bg-gradient-to-r from-red-500/90 to-red-600/90 text-white border border-red-500/20"
    }`}
  >
    <div className="flex items-center gap-2">
      {type === "success" ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <X className="w-5 h-5" />
      )}
      <span>{message}</span>
    </div>
  </motion.div>
);

// Helper function
const calculateTimeAgo = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

export default IdeationDetails;