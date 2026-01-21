import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from 'react-toastify';
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
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/utils/config";
import { ideaAPI } from "@/utils/APIs/ideaAPI";
import { useSelector } from "react-redux";
import { usersAPI } from "@/utils/APIs/userAPI";
import { getProfilePicture } from "@/utils/getProfilePicture";

const BASE_URL = API_BASE_URL + "/ideas";

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
  const [joinMessage, setJoinMessage] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinPosition, setJoinPosition] = useState("");
  const [joinSkills, setJoinSkills] = useState("");
  const [suggestMessage, setSuggestMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const commentInputRef = useRef(null);
  const discussionSectionRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const ideaId = queryParams.get("id")?.toString();
  const { user, access_token } = useSelector((state) => state.auth);
  const [ideaUser, setIdeaUser] = useState(null);
  useEffect(() => {
    const fetchIdea = async () => {
      try {
        setLoading(true);
        const res = await ideaAPI.getIdeaById(ideaId, access_token);
        setIdea(res.data.idea);
        setLikes(res.data.idea.likes ?? 0);

        if (user && res.data.idea.likedBy?.length) {
          setLiked(res.data.idea.likedBy.includes(user.id));
        }
        const comments = await ideaAPI.getIdeaComments(access_token, { ideaId });
        setIdea((prevIdea) => ({
          ...prevIdea,
          comments: comments.data.comments,
        }));
      } catch (error) {
        console.error("Error fetching idea:", error);
        setIdea(null);
      } finally {
        setLoading(false);
      }
    };
    if (ideaId) fetchIdea();
  }, [ideaId, access_token, user]);

  useEffect(() => {
    const fetchIdeaUser = async () => {
      try {
        if (idea?.creator?.id) {
          const res = await usersAPI.getById(idea.creator.id, access_token);
          setIdeaUser(res.user);
        }
      } catch {
        toast.error("Error fetching idea creator details");
      }
    }
    fetchIdeaUser();
  }, [idea, access_token]);
  

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

  const isBookmarked = Boolean(ideaId && bookmarks.has(ideaId));

  const handleBookmark = async (e) => {
    e?.stopPropagation?.();

    if (!ideaId || !user?.id) {
      toast.error("Unable to bookmark at this time");
      return;
    }

    const ideaIdStr = ideaId.toString();
    const wasBookmarked = bookmarks.has(ideaIdStr);

    setBookmarks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ideaIdStr)) {
        newSet.delete(ideaIdStr);
      } else {
        newSet.add(ideaIdStr);
      }
      return newSet;
    });

    try {
      if (wasBookmarked) {
        await ideaAPI.removeIdeaBookmark(user.id, ideaId, access_token);
      } else {
        await ideaAPI.createIdeaBookmark(
          { user_id: user.id, idea_id: ideaId },
          access_token
        );
      }
    } catch (error) {
      console.error("Bookmark toggle error:", error);
      setBookmarks((prev) => {
        const newSet = new Set(prev);
        if (wasBookmarked) {
          newSet.add(ideaIdStr);
        } else {
          newSet.delete(ideaIdStr);
        }
        return newSet;
      });
      toast.error("Failed to update bookmark");
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
        toast.success("Link copied!");
      }
    } catch {
      toast.error("Failed to share");
    }
  };

  const handleStartDiscussion = () => {
    if (discussionSectionRef.current) {
      discussionSectionRef.current.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => commentInputRef.current?.focus(), 400);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to join the team");
        return;
      }

      if (!joinName.trim() || !joinPosition.trim()) {
        toast.error("Please fill in name and position");
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
        const errorMessage = data.error || data.message || "Failed to add team member";
        throw new Error(errorMessage);
      }

      if (data.success && data.data?.team_member) {
        const res = await axios.get(`${BASE_URL}/${ideaId}`);
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const ideaData = isLocal
          ? (res.data.data?.idea || res.data.idea)
          : (res.data.idea || res.data.data?.idea);
        
        if (ideaData) {
          setIdea(ideaData);
        }
        
        setSuccessMsg(data.message || "Successfully joined the team!");
        setJoinMessage("");
        setJoinName("");
        setJoinPosition("");
        setJoinSkills("");
        setTimeout(() => {
          setShowJoinModal(false);
          setSuccessMsg("");
        }, 1500);
      }
    } catch (err) {
      console.error("Error joining team:", err);
      const errorMessage = err.message || "Failed to join team. Please try again.";
      toast.error(errorMessage);
    }
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
      const body = {
        idea_id: ideaId,
        content: comment.trim(),
        author_id: user?.id,
        author_first_name: user?.firstName || "",
        author_last_name: user?.lastName || "",
      }
      const res = await ideaAPI.createIdeaComment(body, access_token);
      if (!res.success) {
        throw new Error("Failed to post comment");
      }

      setIdea((prev) => ({
        ...prev,
        comments: [res.data.comment, ...(prev.comments || [])],
      }));
      setComment("");

    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handleUpdateIdea = async (updateData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Please log in to update this idea");
      }

      const response = await fetch(`${BASE_URL}/${ideaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: updateData.title,
          description: updateData.description,
          project_details: updateData.projectDetails,
          industry: updateData.industry,
          stage: updateData.stage,
          tags: updateData.tags || [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update idea");
      }

      const data = await response.json();
      
      if (data.success && data.data?.idea) {
        setIdea(data.data.idea);
        setSuccessMsg(data.message || "Idea updated successfully");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Error updating idea:", err);
      throw err;
    }
  };

  const handleDeleteIdea = async () => {
    try {
      const response = await ideaAPI.deleteIdea(ideaId, access_token)
      
      if (response.success) {
        setShowDeleteModal(false);
        setSuccessMsg(response?.message || "Idea deleted successfully");
        setTimeout(() => {
          navigate("/ideation");
        }, 1500);
      }
    } catch (err) {
      console.error("Error deleting idea:", err);
      setShowDeleteModal(false);
      toast.error("Failed to delete idea. Please try again.");
    }
  };
  const handleLike = useCallback(
    async (e) => {
      e?.stopPropagation();
      try {
        setLiked((prevLiked) => {
          const newLiked = !prevLiked;
          setLikes((prevLikes) => (newLiked ? prevLikes + 1 : prevLikes - 1));
          return newLiked;
        });

        const res = await ideaAPI.likeIdea(ideaId, access_token);
        setLikes(res.data.idea.likes);
        setLiked(res.data.idea.likedBy.includes(user.id));
      } catch (err) {
        console.error("Error liking idea:", err);
      }
    },
    [ideaId, access_token, user]
  );
  const isCreator = user?.id && idea?.creator?.id && user.id === idea.creator.id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full"
        />

      </div>
    );
  }

  if (!idea) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center text-red-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Idea not found.
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <motion.div
        className="border-b border-white/10 bg-[#0A0A0A]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/ideation"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <motion.div whileHover={{ x: -4 }} transition={{ duration: 0.2 }}>
              <ArrowLeft className="h-5 w-5" />
            </motion.div>
            <span>Back to Ideas</span>
          </Link>

          <div className="flex items-center gap-3">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className={`p-2.5 rounded-xl border border-white/20 ${liked
                ? "bg-red-500/10 text-red-400 border-red-400"
                : "hover:bg-white/10"
                }`}
              onClick={handleLike}
            >
              <motion.div
                animate={liked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
              </motion.div>
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="p-2.5 rounded-xl border border-white/20 hover:bg-white/10"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </motion.button>
            {/* BOOKMARK NOT WORKING */}
            {/* <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className={`p-2.5 rounded-xl border border-white/20 ${
                isBookmarked
                  ? "bg-blue-500/10 text-blue-400 border-blue-400"
                  : "hover:bg-white/10"
              }`}
              onClick={handleBookmark}
              aria-pressed={isBookmarked}
            >
              <motion.div
                animate={isBookmarked ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Bookmark
                  className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
                />
              </motion.div>
            </motion.button> */}

            {isCreator && (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="p-2.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400"
                onClick={() => setShowDeleteModal(true)}
                title="Delete Idea"
              >
                <Trash2 className="h-5 w-5" />
              </motion.button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showShareMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-8 top-16 bg-[#232323] text-xs text-green-400 px-4 py-2 rounded shadow-lg border border-green-700 z-50"
            >
              Link copied!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Layout */}
      <motion.div
        className="w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Card */}
          <motion.div
            className="bg-[#18181A] rounded-2xl p-8"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <h1 className="text-3xl font-bold mb-2">{idea.title}</h1>
            <p className="text-gray-300 mb-4">{idea.description}</p>

            {idea.imageUrl && (
              <img
                src={idea.imageUrl.startsWith('http') ? idea.imageUrl : `${API_BASE_URL}${idea.imageUrl}`}
                alt={idea.title}
                className="w-full h-40 object-contain rounded-lg border border-white/10 mb-4"
              />
            )}

            <motion.div
              className="flex flex-wrap gap-2 mb-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {idea.tags?.map((tag, idx) => (
                <motion.span
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  className="bg-white/5 text-gray-300 text-xs px-2 py-1 rounded-md cursor-default"
                >
                  #{tag}
                </motion.span>
              ))}
            </motion.div>

            <div className="flex items-center gap-6 text-xs text-gray-400 mb-4">
              <motion.span
                className="flex items-center gap-1 cursor-pointer"
                onClick={handleLike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${liked ? "text-red-500 fill-red-500" : "text-gray-400"
                    }`}
                />
                {likes} Likes
              </motion.span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {idea.comments?.length ?? 0} Comments
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {idea.teamMembers?.length ?? 0} Team
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(idea.createdAt).toLocaleDateString()}
              </span>
            </div>

            <motion.div
              className="flex flex-wrap gap-3 pt-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
                onClick={() => setShowJoinModal(true)}
              >
                + Join Project
              </motion.button> */}
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-lg"
                onClick={handleStartDiscussion}
              >
                Start Discussion
              </motion.button>
              {/* <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-lg"
                onClick={() => setShowSuggestModal(true)}
              >
                Suggest Improvement
              </motion.button> */}
            </motion.div>
          </motion.div>

          {/* Project Details */}
          <motion.div
            className="bg-[#18181A] rounded-2xl p-8"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-blue-400" /> Project Details
            </h2>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {idea.projectDetails}
            </p>
          </motion.div>

          {/* Discussion */}
          <motion.div
            className="bg-[#18181A] rounded-2xl p-8"
            ref={discussionSectionRef}
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-400" /> Discussion (
              {idea.comments?.length ?? 0})
            </h2>

            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {idea.comments?.map((c, idx) => (
                <motion.div
                  key={idx}
                  className="flex gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors"
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {c.author?.firstName} {c.author?.lastName}
                    </h3>
                    <p className="text-gray-300">{c.content}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Comment Input */}
            <motion.form
              onSubmit={handleCommentSubmit}
              className="mt-8"
              variants={itemVariants}
            >
              <textarea
                ref={commentInputRef}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment..."
                className="w-full bg-[#232323] rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <motion.button
                  type="submit"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
                >
                  <Send className="h-4 w-4" /> Post Comment
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        </div>

        {/* Sidebar */}
        <Link to={`/user-profile?userId=${idea.creator?.id}`}>
          <div className="space-y-8">
            <motion.div
              className="bg-[#18181A] rounded-2xl p-6 text-center"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <h2 className="text-lg font-bold mb-4">Idea Creator</h2>
              <img
                src={getProfilePicture(ideaUser)}
                alt={`${ideaUser?.firstName} ${ideaUser?.lastName}`}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <h3 className="font-semibold">
                {idea.creator?.firstName} {idea.creator?.lastName}
              </h3>
              {ideaUser?.profile?.city && (
                <p className="text-xs text-gray-400 mt-2">
                  {ideaUser.profile.city}, {ideaUser.profile.country}
                </p>
              )}
              {ideaUser?.profile?.bio && (
                <p className="text-xs text-gray-300 mt-3">{ideaUser.profile.bio}</p>
              )}
              <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
                <span>{ideaUser?.active_startups_count ?? 0} Startups</span>
                <span>XP: {ideaUser?.xp_points ?? 0}</span>
              </div>
            </motion.div>

            {/* <motion.div 
              className="bg-[#18181A] rounded-2xl p-6"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <h2 className="text-lg font-bold mb-4">
                Team ({idea.teamMembers?.length ?? 0})
              </h2>
              <motion.div 
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {idea.teamMembers?.map((m, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              className="p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              whileHover={{ x: 4 }}
            >
              <h3 className="font-medium">{m.name}</h3>
              <p className="text-xs text-gray-400">{m.position}</p>
              {m.skills && (
                <p className="text-xs text-gray-500 mt-1">{m.skills}</p>
              )}
            </motion.div>
                ))}
              </motion.div>
            </motion.div> */}
          </div>
        </Link>
      </motion.div>

      {/* Success Message */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-600 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50"
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS - with AnimatePresence */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#18181A] w-full max-w-md p-6 rounded-2xl relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowJoinModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </motion.button>
              <h2 className="text-xl font-bold mb-4 text-center">
                Join Project Team
              </h2>
              <form onSubmit={handleJoinSubmit} className="space-y-4">
                <input
                  type="text"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  placeholder="Your Name *"
                  required
                  className="w-full bg-[#232323] rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={joinPosition}
                  onChange={(e) => setJoinPosition(e.target.value)}
                  placeholder="Position/Role *"
                  required
                  className="w-full bg-[#232323] rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={joinSkills}
                  onChange={(e) => setJoinSkills(e.target.value)}
                  placeholder="Skills (e.g., Python, React, AWS)"
                  className="w-full bg-[#232323] rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  placeholder="Briefly explain your interest... (optional)"
                  className="w-full bg-[#232323] rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <motion.button
                  type="submit"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
                >
                  Join Team
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#18181A] w-full max-w-md p-6 rounded-2xl relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </motion.button>
              <div className="text-center mb-6">
                <motion.div
                  className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trash2 className="h-8 w-8 text-red-400" />
                </motion.div>
                <h2 className="text-xl font-bold mb-2">Delete Idea</h2>
                <p className="text-gray-400 text-sm">
                  Are you sure you want to delete this idea? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleDeleteIdea}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-white"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUGGEST MODAL */}
      <AnimatePresence>
        {showSuggestModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#18181A] w-full max-w-md p-6 rounded-2xl relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuggestModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </motion.button>
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
                <motion.button
                  type="submit"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
                >
                  Submit Suggestion
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IdeationDetails;
