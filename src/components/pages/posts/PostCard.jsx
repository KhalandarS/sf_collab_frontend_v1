import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Edit,
  Save,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { userSocialAPI } from "@/utils/APIs/socialAPI";
import { useSelector } from "react-redux";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Post Card Component
export default function PostCard({ post, onPostDeleted }) {
  const currentUser = useSelector((state) => state.auth.user);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.caption || "");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const commentInputRef = useRef(null);
  const isOwnPost = currentUser && (post.author?._id === currentUser.id || post.author?.userId === currentUser.id);

  // Normalize media URLs - handle both backend media array format and mediaUrl string
  const getMediaUrls = () => {
    if (Array.isArray(post.media) && post.media.length > 0) {
      return post.media.map((m) => (typeof m === "string" ? m : m.url || m.contentType));
    }
    if (post.mediaUrl) {
      return Array.isArray(post.mediaUrl) ? post.mediaUrl : [post.mediaUrl];
    }
    return [];
  };

  const mediaUrls = getMediaUrls();
  const hasMedia = mediaUrls.length > 0;
  const hasMultipleImages = post.type === "image" && mediaUrls.length > 1;
  const primaryMediaUrl = mediaUrls[0];

  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await userSocialAPI.deletePost(post._id || post.id);
      onPostDeleted?.(post._id || post.id);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEditPost = async () => {
    if (!editedCaption.trim()) return;
    try {
      await userSocialAPI.editPost(post._id || post.id, { caption: editedCaption });
      post.caption = editedCaption;
      setIsEditing(false);
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  const handleSavePost = async () => {
    try {
      if (saved) {
        await userSocialAPI.unsavePost(post._id || post.id);
      } else {
        await userSocialAPI.savePost(post._id || post.id);
      }
      setSaved(!saved);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleLoadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    setLoadingComments(true);
    try {
      const data = await userSocialAPI.getComments(post._id || post.id);
      setComments(data.comments || []);
      setShowComments(true);
    } catch (error) {
      console.error("Load comments failed:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const result = await userSocialAPI.addComment(post._id || post.id, { text: newComment });
      setComments([...comments, result.comment]);
      setNewComment("");
    } catch (error) {
      console.error("Comment failed:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await userSocialAPI.deleteComment(post._id || post.id, commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Delete comment failed:", error);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50 hover:border-zinc-700/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-blue-400/50">
                <AvatarImage src={post.author?.avatar || post.author?.picture} />
                <AvatarFallback>{post.author?.name || post.author?.firstName}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm text-white">
                  {post.author?.name || `${post.author?.firstName} ${post.author?.lastName}`}
                </p>
                <p className="text-xs text-zinc-400">{post.timestamp || new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {isOwnPost && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-zinc-400 hover:text-blue-400 hover:bg-zinc-800"
                  >
                    <Edit size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDeletePost}
                    className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                  >
                    <Trash2 size={18} />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSavePost}
                className={`${saved ? "text-yellow-400" : "text-zinc-400"} hover:text-yellow-400 hover:bg-zinc-800`}
              >
                <Save size={18} className={saved ? "fill-yellow-400" : ""} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <MoreHorizontal size={18} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {isEditing ? (
            <div className="flex gap-2">
              <textarea
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                className="flex-1 bg-zinc-800 text-white rounded p-2 text-sm"
                rows="3"
              />
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={handleEditPost}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              {post.caption && (
                <p className={`text-zinc-300 leading-relaxed ${
                  post.type === "text" ? "text-base" : "text-sm"
                }`}>
                  {post.caption}
                </p>
              )}
              {post.content && !post.caption && (
                <p className={`text-zinc-300 leading-relaxed ${post.type === "text" ? "text-base" : "text-sm"}`}>
                  {post.content}
                </p>
              )}
            </>
          )}

          {post.type !== "text" && hasMedia && (
            <motion.div
              className="relative group cursor-pointer"
              whileHover={{ scale: hasMultipleImages ? 1.02 : 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {post.type === "image" ? (
                hasMultipleImages ? (
                  <div className="grid grid-cols-2 gap-2">
                    {mediaUrls.slice(0, 4).map((url, idx) => (
                      <div key={idx} className="relative rounded-lg overflow-hidden h-[200px]">
                        <img
                          src={url}
                          alt={`Post content ${idx}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={primaryMediaUrl}
                      alt="Post content"
                      className="w-full h-auto max-h-[500px] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-white">
                        <Eye size={20} />
                        <span className="text-sm font-medium">View Full</span>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <video
                  src={primaryMediaUrl}
                  className="w-full rounded-xl max-h-[500px]"
                  controls
                />
              )}
            </motion.div>
          )}

          <Separator className="bg-zinc-800/50" />

          <PostActions
            post={post}
            liked={liked}
            setLiked={setLiked}
            bookmarked={bookmarked}
            setBookmarked={setBookmarked}
          />

          {/* Comments Section */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLoadComments}
            className="w-full text-zinc-400 hover:text-white gap-2"
          >
            <MessageCircle size={16} />
            {showComments ? "Hide" : "Show"} Comments ({comments.length})
          </Button>

          {showComments && (
            <div className="space-y-3 border-t border-zinc-800/50 pt-3">
              {/* Comments List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment._id} className="bg-zinc-800/30 rounded p-2 text-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-blue-400">{comment.author?.firstName || "User"}</p>
                        <p className="text-zinc-300">{comment.text}</p>
                        <p className="text-xs text-zinc-500 mt-1">{new Date(comment.createdAt).toLocaleDateString()}</p>
                      </div>
                      {(currentUser?.id === comment.author?._id || isOwnPost) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment Input */}
              <div className="flex gap-2">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  placeholder="Add a comment..."
                  className="flex-1 bg-zinc-800 text-white rounded px-3 py-2 text-sm outline-none"
                />
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Post
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};