import React, { useState, useEffect, useRef, useCallback } from "react";
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
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

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
  const [joinMessage, setJoinMessage] = useState("");
  const [suggestMessage, setSuggestMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const commentInputRef = useRef(null);
  const discussionSectionRef = useRef(null);
  const location = useLocation();

  // Get idea ID from URL query (example: ?id=123)
  const queryParams = new URLSearchParams(location.search);
  const ideaId = queryParams.get("id")?.toString();

  // Fetch idea data from API
  useEffect(() => {
    const fetchIdea = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://sfcolab-backend.onrender.com/api/ideation/${ideaId}`
        );
        const data = res.data.idea;
        setIdea(data);
        setLikes(data.likes ?? 0);

        // Determine if current user liked this idea
        const token = localStorage.getItem("authToken");
        if (token && data.likedBy?.length) {
          const userId = parseJwt(token)?.userId;
          setLiked(data.likedBy.includes(userId));
        }
      } catch (error) {
        console.error("Error fetching idea:", error);
      } finally {
        setLoading(false);
      }
    };
    if (ideaId) fetchIdea();
  }, [ideaId]);

  // Helper to decode JWT and get user ID
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const handleLike = useCallback(
    async (e) => {
      e?.stopPropagation(); // safe: may be called without event
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("Please log in to like this idea");
          return;
        }

        // Optimistic UI update
        setLiked((prevLiked) => {
          const newLiked = !prevLiked;
          setLikes((prevLikes) => (newLiked ? prevLikes + 1 : prevLikes - 1));
          return newLiked;
        });

        // Backend sync
        const res = await axios.post(
          `https://sfcolab-backend.onrender.com/api/ideation/${ideaId}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Final state sync
        setLikes(res.data.likes);
        setLiked(res.data.likedByUser);
      } catch (err) {
        console.error("Error liking idea:", err);
      }
    },
    [ideaId]
  );

  // ✅ Fetch Bookmarks — graceful handling of API shape
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await fetch(
          `https://sfcolab-backend.onrender.com/api/ideation/bookmarks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch bookmarks");

        const data = await response.json();

        // Handle object or array gracefully
        let bookmarkArray = [];
        if (Array.isArray(data.bookmarks)) {
          bookmarkArray = data.bookmarks;
        } else if (data.bookmarks?.ideas) {
          bookmarkArray = data.bookmarks.ideas;
        } else if (data.ideas) {
          bookmarkArray = data.ideas;
        }

        const bookmarkSet = new Set(
          bookmarkArray.map((b) => (b.ideaId ? b.ideaId.toString() : b.toString()))
        );

        setBookmarks(bookmarkSet);
      } catch (error) {
        console.error("Bookmarks fetch error:", error);
      }
    };

    fetchBookmarks();
  }, []);

  // Whether current idea is bookmarked
  const isBookmarked = Boolean(ideaId && bookmarks.has(ideaId));

  // Toggle bookmark — communicates with backend toggle endpoint
  const handleBookmark = async (e) => {
    e?.stopPropagation?.();

    if (!ideaId) {
      setBookmarkNotification("No idea selected to bookmark");
      setTimeout(() => setBookmarkNotification(""), 2000);
      return;
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
      setBookmarkNotification("Please log in to bookmark ideas");
      setTimeout(() => setBookmarkNotification(""), 2000);
      return;
    }

    // Track old state so we can revert on failure
    const ideaIdStr = ideaId.toString();
    const wasBookmarked = bookmarks.has(ideaIdStr);

    // Optimistic update
    setBookmarks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ideaIdStr)) {
        newSet.delete(ideaIdStr);
        setBookmarkNotification("Bookmark removed");
      } else {
        newSet.add(ideaIdStr);
        setBookmarkNotification("Idea bookmarked!");
      }
      setTimeout(() => setBookmarkNotification(""), 2000);
      return newSet;
    });

    try {
      const response = await fetch(
        `https://sfcolab-backend.onrender.com/api/ideation/${ideaIdStr}/bookmark`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle bookmark");
      }

      // If backend returns updated bookmarks, use it to sync local state
      const data = await response.json();
      if (data?.bookmarks) {
        // support various shapes
        let bookmarkArray = [];
        if (Array.isArray(data.bookmarks)) {
          bookmarkArray = data.bookmarks;
        } else if (data.bookmarks?.ideas) {
          bookmarkArray = data.bookmarks.ideas;
        } else if (data.ideas) {
          bookmarkArray = data.ideas;
        }

        const bookmarkSet = new Set(
          bookmarkArray.map((b) => (b.ideaId ? b.ideaId.toString() : b.toString()))
        );
        setBookmarks(bookmarkSet);
      } else if (typeof data?.bookmarked === "boolean") {
        // if backend returns { bookmarked: true/false }
        setBookmarks((prev) => {
          const newSet = new Set(prev);
          if (data.bookmarked) {
            newSet.add(ideaIdStr);
          } else {
            newSet.delete(ideaIdStr);
          }
          return newSet;
        });
      } else {
       
      }
    } catch (error) {
      console.error("Bookmark toggle error:", error);
      // Revert optimistic change
      setBookmarks((prev) => {
        const newSet = new Set(prev);
        if (wasBookmarked) {
          newSet.add(ideaIdStr);
        } else {
          newSet.delete(ideaIdStr);
        }
        return newSet;
      });
      setBookmarkNotification("Failed to update bookmark");
      setTimeout(() => setBookmarkNotification(""), 2000);
    }
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/ideation-details?id=${ideaId}`;
      if (navigator.share) {
        await navigator.share({
          title: idea?.title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShowShareMsg(true);
        setTimeout(() => setShowShareMsg(false), 1500);
      }
    } catch {
      setShowShareMsg(true);
      setTimeout(() => setShowShareMsg(false), 1500);
    }
  };

  const handleStartDiscussion = () => {
    if (discussionSectionRef.current) {
      discussionSectionRef.current.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => commentInputRef.current?.focus(), 400);
    }
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg("Request sent! The team will review your interest.");
    setJoinMessage("");
    setTimeout(() => {
      setShowJoinModal(false);
      setSuccessMsg("");
    }, 1500);
  };

  const handleSuggestSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg("Thank you for your suggestion!");
    setSuggestMessage("");
    setTimeout(() => {
      setShowSuggestModal(false);
      setSuccessMsg("");
    }, 1500);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const res = await fetch(
        `https://sfcolab-backend.onrender.com/api/ideation/${ideaId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ content: comment }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setIdea((prev) => ({
          ...prev,
          comments: [data.comment, ...(prev.comments || [])],
        }));
        setComment("");
      }
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading idea details...
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Idea not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/ideation"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Ideas</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              className={`p-2.5 rounded-xl border border-white/20 ${
                liked
                  ? "bg-red-500/10 text-red-400 border-red-400"
                  : "hover:bg-white/10"
              }`}
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
            </button>
            <button
              className="p-2.5 rounded-xl border border-white/20 hover:bg-white/10"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              className={`p-2.5 rounded-xl border border-white/20 ${
                isBookmarked
                  ? "bg-blue-500/10 text-blue-400 border-blue-400"
                  : "hover:bg-white/10"
              }`}
              onClick={handleBookmark}
              aria-pressed={isBookmarked}
            >
              <Bookmark
                className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
              />
            </button>
          </div>
        </div>
        {showShareMsg && (
          <div className="absolute right-8 top-16 bg-[#232323] text-xs text-green-400 px-4 py-2 rounded shadow-lg border border-green-700 z-50">
            Link copied!
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#18181A] rounded-2xl p-8">
            <h1 className="text-3xl font-bold mb-2">{idea.title}</h1>
            <p className="text-gray-300 mb-4">{idea.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {idea.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-white/5 text-gray-300 text-xs px-2 py-1 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6 text-xs text-gray-400 mb-4">
              <span
                className="flex items-center gap-1 cursor-pointer"
                onClick={handleLike}
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    liked ? "text-red-500 fill-red-500" : "text-gray-400"
                  }`}
                />{" "}
                {likes} Likes
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />{" "}
                {idea.comments?.length ?? 0} Comments
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {idea.teamMembers?.length ?? 0}{" "}
                Team
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />{" "}
                {new Date(idea.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
                onClick={() => setShowJoinModal(true)}
              >
                + Join Project
              </button>
              <button
                className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-lg"
                onClick={handleStartDiscussion}
              >
                Start Discussion
              </button>
              <button
                className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-lg"
                onClick={() => setShowSuggestModal(true)}
              >
                Suggest Improvement
              </button>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-[#18181A] rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-blue-400" /> Project Details
            </h2>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {idea.projectDetails}
            </p>
          </div>

          {/* Discussion */}
          <div
            className="bg-[#18181A] rounded-2xl p-8"
            ref={discussionSectionRef}
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-400" /> Discussion (
              {idea.comments?.length ?? 0})
            </h2>

            <div className="space-y-6">
              {idea.comments?.map((c) => (
                <div key={c._id} className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {c.author?.firstName} {c.author?.lastName}
                    </h3>
                    <p className="text-gray-300">{c.content}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="mt-8">
              <textarea
                ref={commentInputRef}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment..."
                className="w-full bg-[#232323] rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                  <Send className="h-4 w-4" /> Post Comment
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-[#18181A] rounded-2xl p-6 text-center">
            <h2 className="text-lg font-bold mb-4">Idea Creator</h2>
            <h3 className="font-semibold">
              {idea.creator?.firstName} {idea.creator?.lastName}
            </h3>
          </div>

          <div className="bg-[#18181A] rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">
              Team ({idea.teamMembers?.length ?? 0})
            </h2>
            <div className="space-y-3">
              {idea.teamMembers?.map((m, i) => (
                <div key={i}>
                  <h3 className="font-medium">{m.name}</h3>
                  <p className="text-xs text-gray-400">{m.position}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bookmark Notification */}
      {bookmarkNotification && (
        <div className="fixed bottom-4 right-4 bg-[#232323] text-green-400 px-4 py-2 rounded shadow-lg border border-green-700 z-50">
          {bookmarkNotification}
        </div>
      )}

      {/* Success Message */}
      {successMsg && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-600 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50">
          {successMsg}
        </div>
      )}

      {/* JOIN PROJECT MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#18181A] w-full max-w-md p-6 rounded-2xl relative">
            <button
              onClick={() => setShowJoinModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              Join Project Team
            </h2>
            <form onSubmit={handleJoinSubmit}>
              <textarea
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                placeholder="Briefly explain your interest..."
                className="w-full bg-[#232323] rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
              >
                Send Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUGGEST MODAL */}
      {showSuggestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#18181A] w-full max-w-md p-6 rounded-2xl relative">
            <button
              onClick={() => setShowSuggestModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              Suggest an Improvement
            </h2>
            <form onSubmit={handleSuggestSubmit}>
              <textarea
                value={suggestMessage}
                onChange={(e) => setSuggestMessage(e.target.value)}
                placeholder="Share your idea..."
                className="w-full bg-[#232323] rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
              >
                Submit Suggestion
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeationDetails;
