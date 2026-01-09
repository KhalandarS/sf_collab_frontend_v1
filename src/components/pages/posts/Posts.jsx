import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  ChevronRight,
  ArrowUp,
  Home,
  Search,
  Plus,
  User,
  Bell,
} from "lucide-react";
import { Button } from "../../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import Stories from "./stories";
import LeftSidebar from "./LeftSidebar";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import RightSidebar from "./RightSiderbar";
import { useSelector } from "react-redux";
import { postAPI } from "@/utils/APIs/postAPI";

// type Post = {
//   id: number;
//   author: {
//     id: number;
//     name: string;
//     avatar: string;
//   };
//   caption: string | null;
//   media: {
//     type: "image" | "video";
//     urls: string[];
//   } | null;
//   likes_count: number;
//   comments_count: number;
//   liked_by_me: boolean;
//   bookmarked_by_me: boolean;
//   created_at: string;
// };

// ShinyText Component
const ShinyText = ({ children, className = "" }) => {
  return (
    <span
      className={`inline-block bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] ${className}`}
    >
      {children}
    </span>
  );
};










// Share Sheet Component
const ShareSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
        >
          <Share2 size={18} />
          <span className="text-xs font-medium">Share</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-zinc-950 border-zinc-800 text-white">
        <SheetHeader>
          <SheetTitle>
            <ShinyText>Share Post</ShinyText>
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-3 mt-6">
          {["Copy Link", "Share to Twitter", "Share to LinkedIn", "Email"].map(
            (option) => (
              <Button
                key={option}
                variant="outline"
                className="w-full justify-start bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:border-blue-500/50 transition-all"
              >
                <ChevronRight size={16} className="mr-2" />
                {option}
              </Button>
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};






// Main Posts Component - UPDATED WITH 3-CELL GRID
const Posts = () => {
  const { user: currentUser, access_token } = useSelector((state) => state.auth);




  const [posts, setPosts] = useState([]);
  useEffect(() => {
    // In Posts.jsx - add safety check
const fetchPosts = async () => {
  try {
    // Ensure you pass an object with a page property
    const response = await postAPI.getAll({ page: 1, limit: 10 }); 
    setPosts(response.data.posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
};
    fetchPosts();
  }, [access_token]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleCreatePost = (postData) => {
    const response = postAPI.create(postData, access_token);

      // setPosts([response.data.post, ...posts]);
  };

  return (
    <div className="min-h-screen text-white w-full">
      {/* Title Section */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold">This Feature is Coming Soon!</h1>
      </div>

      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        <div className="absolute top-1/4 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute top-1/3 -right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main 3-Cell Grid Layout */}
      <div className="relative w-full mx-auto px-3">
        <div className="grid grid-cols-12 gap-4">
          {/* ---- LEFT SIDEBAR (hidden on mobile, sticky on lg) ---- */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-0 space-y-2">
              <LeftSidebar />
            </div>
          </div>

          {/* ---- CENTER FEED (full width on mobile, 6 cols on lg) ---- */}
          <div className="col-span-12 lg:col-span-6">
            <div className="space-y-6">
              {/* Stories */}
              <Stories />

              {/* Create Post */}
              {currentUser && (
                <CreatePost currentUser={currentUser} onPost={handleCreatePost} />
              )}

              {/* Posts Feed */}
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ---- RIGHT SIDEBAR (hidden on mobile, sticky on lg) ---- */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-0 space-y-2">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800/50 md:hidden">
        <div className="flex justify-around items-center p-3">
          <Button variant="ghost" size="icon" className="text-blue-400">
            <Home size={24} />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400">
            <Search size={24} />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400">
            <Plus size={24} />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400">
            <Bell size={24} />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400">
            <User size={24} />
          </Button>
        </div>
      </div>

      {/* Floating Action Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-20 right-8 z-50"
          >
            <Button
              size="icon"
              className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/50"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ArrowUp size={20} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default Posts;
