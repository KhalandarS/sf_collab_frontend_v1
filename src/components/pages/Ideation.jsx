// import {
//   MessageSquare,
//   ThumbsUp,
//   Users,
//   Calendar,
//   ArrowUpRight,
//   TrendingUp,
//   Lightbulb,
//   Star,
//   Eye,
//   Clock,
//   Share2,
//   Bookmark,
//   Heart,
//   MessageCircle,
//   User,
//   Trophy,
//   Zap,
//   Plus,
//   Tag,
//   WifiOff,
//   RefreshCw,
// } from "lucide-react";
// import React, { useState, useEffect, useMemo } from "react";
// import { Link } from "react-router-dom";
// import IdeationHeader from "../headers/IdeationHeader";
// import ScrollToTop from "../sections/ScrollToTop";

// // API Configuration - Single base URL for all ideation API calls
// const BASE_URL =
//   window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
//     ? "http://localhost:5000/api/ideas"
//     : "https://sfcolab-backend.onrender.com/api/ideation";

// // Helper to decode JWT and get user ID
// const parseJwt = (token) => {
//   try {
//     return JSON.parse(atob(token.split(".")[1]));
//   } catch (e) {
//     return null;
//   }
// };

// const Ideation = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedStage, setSelectedStage] = useState("All Stages");
//   const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
//   const [sortBy, setSortBy] = useState("trending");
//   const [bookmarkNotification, setBookmarkNotification] = useState("");
//   const [showShareMsg, setShowShareMsg] = useState(false);
//   const [ideas, setIdeas] = useState([]);
//   const [bookmarks, setBookmarks] = useState(new Set());
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [networkError, setNetworkError] = useState(false);
//   const [currentUserId, setCurrentUserId] = useState(null);

//   // Get current user ID from token
//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       const decoded = parseJwt(token);
//       setCurrentUserId(decoded?.userId || decoded?.id || null);
//     }
//   }, []);

//   // Load ideas on mount
//   useEffect(() => {
//     fetchIdeas();
//   }, []);

//   // Fetch ideas from API
//   const fetchIdeas = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       setNetworkError(false);

//       const response = await fetch(
//         `${BASE_URL}?page=1&per_page=20&category=${
//           selectedIndustry === "All Industries" ? "" : selectedIndustry
//         }&search=${searchQuery || ""}&sortBy=${
//           sortBy === "trending" ? "likes" : sortBy
//         }&sortOrder=desc`
//       );

//       if (!response.ok) {
//         throw new Error(`API Error: ${response.status}`);
//       }

//       const data = await response.json();

//       // Handle different response structures: local uses data.data.ideas, deployed uses data.ideas
//       const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
//       const ideasArray = isLocal 
//         ? (data.data?.ideas || data.ideas || [])
//         : (data.ideas || data.data?.ideas || []);

//       const mappedIdeas = ideasArray.map((idea) => ({
//         id: idea.id || idea._id,
//         title: idea.title,
//         description: idea.description || "No description available.",
//         stage: idea.stage,
//         category: idea.industry || idea.category,
//         privacy: idea.privacy || "public",
//         creatorId: idea.creator?.id || idea.creatorId,
//         author: {
//           name: `${idea.creator.firstName} ${idea.creator.lastName}`,
//           role: idea.creator.position || "Contributor",
//           avatar: idea.creator.avatar || "https://i.pravatar.cc/150?img=11",
//         },
//         createdAt: new Date(idea.createdAt).toLocaleDateString("en-US", {
//           month: "long",
//           day: "numeric",
//           year: "numeric",
//         }),
//         timeAgo: calculateTimeAgo(idea.createdAt),
//         likes: idea.likes || 0,
//         comments: idea.commentsCount || idea.comments || 0,
//         collaborators: idea.teamSize || idea.collaborators || 1,
//         tags: Array.isArray(idea.tags)
//           ? idea.tags
//           : typeof idea.tags === "string"
//           ? [idea.tags]
//           : [],
//       }));

//       setIdeas(mappedIdeas);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setNetworkError(true);
//       setError("Unable to connect to the server.");
//       setIdeas([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Calculate time ago
//   const calculateTimeAgo = (createdAt) => {
//     const now = new Date();
//     const created = new Date(createdAt);
//     const diffMs = now - created;
//     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//     if (diffHours < 24)
//       return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
//     const diffDays = Math.floor(diffHours / 24);
//     return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
//   };

//   // Handle idea creation
//   const handleCreateIdea = async (payload) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) throw new Error("Unauthorized: No token found");

//       const response = await fetch(`${BASE_URL}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           title: payload.title,
//           description: payload.description,
//           projectDetails: payload.projectDetails || "",
//           industry: payload.industry,
//           stage: payload.stage,
//           teamMembers: payload.teamMembers || [],
//           tags: payload.tags || [],
//         }),
//       });

//       if (!response.ok) {
//         if (response.status === 401)
//           throw new Error("Unauthorized: Invalid token");
//         throw new Error("Failed to create idea");
//       }

//       const newIdea = await response.json();

//       const formattedIdea = {
//         ...newIdea,
//         author: {
//           name: "You",
//           role: "Contributor",
//           avatar: "https://i.pravatar.cc/150?img=11",
//         },
//         timeAgo: "just now",
//         createdAt: new Date().toLocaleDateString("en-US", {
//           month: "long",
//           day: "numeric",
//           year: "numeric",
//         }),
//         likes: 0,
//         comments: 0,
//         collaborators: 1,
//       };

//       setIdeas((prev) => [formattedIdea, ...prev]);
//       setSortBy("latest");
//       setSearchQuery("");
//     } catch (err) {
//       console.error("Failed to create idea:", err);
//       setError(err.message || "Failed to create idea. Please try again.");
//     }
//   };

//   // Re-fetch when filters change
//   useEffect(() => {
//     fetchIdeas();
//   }, [selectedStage, selectedIndustry, sortBy, searchQuery]);

//   const getStageColor = (stage) => {
//     const colors = {
//       "Idea Stage": "bg-blue-500/20 text-blue-400",
//       "Concept Stage": "bg-amber-500/20 text-amber-400",
//       "Development Stage": "bg-green-500/20 text-green-400",
//       "Research Stage": "bg-purple-500/20 text-purple-400",
//       "MVP Stage": "bg-red-500/20 text-red-400",
//     };
//     return colors[stage] || "bg-gray-500/20 text-gray-400";
//   };

//   // ✅ Fetch Bookmarks — now matches backend object structure
//   useEffect(() => {
//     const fetchBookmarks = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) return;

//         const response = await fetch(`${BASE_URL}/bookmarks`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!response.ok) throw new Error("Failed to fetch bookmarks");

//         const data = await response.json();

//         // ✅ Handle object or array gracefully
//         let bookmarkArray = [];
//         if (Array.isArray(data.bookmarks)) {
//           bookmarkArray = data.bookmarks;
//         } else if (data.bookmarks?.ideas) {
//           bookmarkArray = data.bookmarks.ideas;
//         }

//         const bookmarkSet = new Set(
//           bookmarkArray.map((b) => b.ideaId?.toString())
//         );

//         setBookmarks(bookmarkSet);
//       } catch (error) {
//         console.error("Bookmarks fetch error:", error);
//       }
//     };

//     fetchBookmarks();
//   }, []);

//   // Toggle bookmark — communicates with backend toggle endpoint
//   const handleBookmark = async (idea) => {
//     const ideaId = idea.id || idea._id;
//     const token = localStorage.getItem("authToken");

//     if (!token) {
//       setBookmarkNotification("Please log in to bookmark ideas");
//       setTimeout(() => setBookmarkNotification(""), 2000);
//       return;
//     }

//     // Optimistic update
//     setBookmarks((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(ideaId)) {
//         newSet.delete(ideaId);
//         setBookmarkNotification("Bookmark removed");
//       } else {
//         newSet.add(ideaId);
//         setBookmarkNotification("Idea bookmarked!");
//       }
//       setTimeout(() => setBookmarkNotification(""), 2000);
//       return newSet;
//     });

//     try {
//       const response = await fetch(
//         `${BASE_URL}/${ideaId}/bookmark`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to toggle bookmark");
//     } catch (error) {
//       console.error("Bookmark toggle error:", error);
//       setBookmarkNotification("Failed to update bookmark");
//       setTimeout(() => setBookmarkNotification(""), 2000);
//     }
//   };

//   // Share idea
//   const handleShare = async (idea) => {
//     try {
//       const url = `${window.location.origin}/ideation-details?id=${idea.id}`;
//       const title = idea.title;
//       if (navigator.share) {
//         await navigator.share({ title, url });
//       } else {
//         await navigator.clipboard.writeText(url);
//         setShowShareMsg(true);
//         setTimeout(() => setShowShareMsg(false), 1500);
//       }
//     } catch {
//       setShowShareMsg(true);
//       setTimeout(() => setShowShareMsg(false), 1500);
//     }
//   };

//   const handleRetry = () => fetchIdeas();

//   // === UI ===
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <p className="text-gray-300">Loading ideas...</p>
//       </div>
//     );
//   }

//   if (networkError) {
//     return (
//       <div className="min-h-screen bg-black">
//         <IdeationHeader
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           selectedStage={selectedStage}
//           setSelectedStage={setSelectedStage}
//           selectedIndustry={selectedIndustry}
//           setSelectedIndustry={setSelectedIndustry}
//           sortBy={sortBy}
//           setSortBy={setSortBy}
//           onCreateIdea={handleCreateIdea}
//         />
//         <div className="flex flex-col items-center justify-center py-12 px-4">
//           <div className="bg-[#1A1A1A] rounded-2xl p-8 max-w-md w-full text-center">
//             <div className="flex justify-center mb-4">
//               <div className="bg-red-500/20 p-4 rounded-full">
//                 <WifiOff className="h-8 w-8 text-red-500" />
//               </div>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-300 mb-2">
//               Network Connection Issue
//             </h3>
//             <p className="text-gray-400 mb-6">
//               {error ||
//                 "Unable to connect to the server. Please check your internet connection."}
//             </p>
//             <div className="flex gap-3 justify-center">
//               <button
//                 onClick={handleRetry}
//                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
//               >
//                 <RefreshCw className="h-4 w-4" />
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black">
//       <div className="mb-0">
//         <IdeationHeader
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           selectedStage={selectedStage}
//           setSelectedStage={setSelectedStage}
//           selectedIndustry={selectedIndustry}
//           setSelectedIndustry={setSelectedIndustry}
//           sortBy={sortBy}
//           setSortBy={setSortBy}
//           onCreateIdea={handleCreateIdea}
//         />
//       </div>

//       {error && !networkError && (
//         <div className="mx-4 mt-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
//           <div className="flex items-center gap-2 text-yellow-400">
//             <WifiOff className="h-4 w-4" />
//             <span className="text-sm">{error}</span>
//           </div>
//         </div>
//       )}

//       {/* Idea cards grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 max-sm:p-2">
//         {ideas.map((content) => {
//           const isPrivate = content.privacy === "private";
//           const isCreator = currentUserId && content.creatorId && currentUserId === content.creatorId;
//           const shouldBlur = isPrivate && !isCreator;
//           const canAccess = !isPrivate || isCreator;

//           return (
//             <div key={content.id} className="group relative">
//               {canAccess ? (
//                 <Link
//                   to={`/ideation-details?id=${content.id}`}
//                   className="block bg-[#1A1A1A] border border-white/10 rounded-xl hover:border-white/20 hover:bg-[#212121] transition-all duration-300 group-hover:scale-[1.02] h-full relative"
//                 >
//                   {shouldBlur && (
//                     <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-10 flex items-center justify-center">
//                       <div className="text-center p-4">
//                         <div className="text-gray-400 text-sm mb-2">🔒 Private Idea</div>
//                         <div className="text-gray-500 text-xs">Only the creator can view this</div>
//                       </div>
//                     </div>
//                   )}
//                   <div className={`p-6 space-y-4 ${shouldBlur ? 'blur-sm pointer-events-none' : ''}`}>
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center gap-3">
//                         <img
//                           src={content.author.avatar}
//                           alt={content.author.name}
//                           className="h-10 w-10 rounded-full object-cover"
//                         />
//                         <div>
//                           <h3 className="font-medium text-sm text-white">
//                             {content.author.name}
//                           </h3>
//                           <p className="text-xs text-gray-400">
//                             {content.author.role}
//                           </p>
//                         </div>
//                       </div>
//                       <span
//                         className={`${getStageColor(
//                           content.stage
//                         )} text-xs px-2 py-1 rounded-full font-medium`}
//                       >
//                         {content.stage}
//                       </span>
//                     </div>

//                     <div className="space-y-2">
//                       <h2 className="text-lg font-bold text-white leading-tight line-clamp-2">
//                         {content.title}
//                       </h2>
//                       <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
//                         {content.description}
//                       </p>
//                     </div>

//                     <div className="flex flex-wrap gap-1.5">
//                       {Array.isArray(content.tags) &&
//                         content.tags.slice(0, 3).map((tag, index) => (
//                           <span
//                             key={index}
//                             className="bg-white/5 text-gray-300 text-xs px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
//                           >
//                             #{tag}
//                           </span>
//                         ))}

//                       {Array.isArray(content.tags) && content.tags.length > 3 && (
//                         <span className="text-gray-400 text-xs px-2 py-1">
//                           +{content.tags.length - 3}
//                         </span>
//                       )}
//                     </div>

//                     <div className="flex items-center justify-between pt-3 border-t border-white/5">
//                       <div className="flex items-center gap-4 text-xs text-gray-400">
//                         <span className="flex items-center gap-1">
//                           <Heart className="h-3 w-3" />
//                           {content.likes}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <MessageCircle className="h-3 w-3" />
//                           {content.comments}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <Users className="h-3 w-3" />
//                           {content.collaborators}
//                         </span>
//                       </div>
//                       <span className="text-xs text-gray-500 flex items-center gap-1">
//                         <Clock className="h-3 w-3" />
//                         {content.timeAgo}
//                       </span>
//                     </div>

//                     <div className="flex items-center justify-center pt-2">
//                       <span className="text-blue-400 text-sm font-medium flex items-center gap-1 group-hover:text-blue-300 transition-colors">
//                         <MessageSquare className="h-4 w-4" />
//                         Join Discussion
//                       </span>
//                     </div>
//                   </div>
//                 </Link>
//               ) : (
//                 <div className="block bg-[#1A1A1A] border border-white/10 rounded-xl h-full relative overflow-hidden cursor-not-allowed">
//                   {shouldBlur && (
//                     <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-10 flex items-center justify-center">
//                       <div className="text-center p-4">
//                         <div className="text-gray-400 text-sm mb-2">🔒 Private Idea</div>
//                         <div className="text-gray-500 text-xs">Only the creator can view this</div>
//                       </div>
//                     </div>
//                   )}
//                   <div className={`p-6 space-y-4 ${shouldBlur ? 'blur-sm pointer-events-none' : ''}`}>
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center gap-3">
//                         <img
//                           src={content.author.avatar}
//                           alt={content.author.name}
//                           className="h-10 w-10 rounded-full object-cover"
//                         />
//                         <div>
//                           <h3 className="font-medium text-sm text-white">
//                             {content.author.name}
//                           </h3>
//                           <p className="text-xs text-gray-400">
//                             {content.author.role}
//                           </p>
//                         </div>
//                       </div>
//                       <span
//                         className={`${getStageColor(
//                           content.stage
//                         )} text-xs px-2 py-1 rounded-full font-medium`}
//                       >
//                         {content.stage}
//                       </span>
//                     </div>

//                     <div className="space-y-2">
//                       <h2 className="text-lg font-bold text-white leading-tight line-clamp-2">
//                         {content.title}
//                       </h2>
//                       <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
//                         {content.description}
//                       </p>
//                     </div>

//                     <div className="flex flex-wrap gap-1.5">
//                       {Array.isArray(content.tags) &&
//                         content.tags.slice(0, 3).map((tag, index) => (
//                           <span
//                             key={index}
//                             className="bg-white/5 text-gray-300 text-xs px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
//                           >
//                             #{tag}
//                           </span>
//                         ))}

//                       {Array.isArray(content.tags) && content.tags.length > 3 && (
//                         <span className="text-gray-400 text-xs px-2 py-1">
//                           +{content.tags.length - 3}
//                         </span>
//                       )}
//                     </div>

//                     <div className="flex items-center justify-between pt-3 border-t border-white/5">
//                       <div className="flex items-center gap-4 text-xs text-gray-400">
//                         <span className="flex items-center gap-1">
//                           <Heart className="h-3 w-3" />
//                           {content.likes}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <MessageCircle className="h-3 w-3" />
//                           {content.comments}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <Users className="h-3 w-3" />
//                           {content.collaborators}
//                         </span>
//                       </div>
//                       <span className="text-xs text-gray-500 flex items-center gap-1">
//                         <Clock className="h-3 w-3" />
//                         {content.timeAgo}
//                       </span>
//                     </div>

//                     <div className="flex items-center justify-center pt-2">
//                       <span className="text-blue-400 text-sm font-medium flex items-center gap-1 group-hover:text-blue-300 transition-colors">
//                         <MessageSquare className="h-4 w-4" />
//                         Join Discussion
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {canAccess && (
//                 <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
//                   <button
//                     className={`bg-white/20 p-2 rounded-lg transition-colors ${
//                       bookmarks.has(content.id)
//                         ? "bg-blue-500/10 text-blue-400 border border-blue-400"
//                         : "hover:bg-white/30"
//                     }`}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       handleBookmark(content);
//                     }}
//                   >
//                     <Bookmark
//                       className={`h-4 w-4 ${
//                         bookmarks.has(content.id)
//                           ? "text-blue-400 fill-current"
//                           : "text-white"
//                       }`}
//                     />
//                   </button>

//                   <button
//                     className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       handleShare(content);
//                     }}
//                   >
//                     <Share2 className="h-4 w-4 text-white" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {ideas.length === 0 && !isLoading && (
//         <div className="flex flex-col items-center justify-center py-16 px-4">
//           <div className="text-center space-y-4">
//             <Lightbulb className="h-16 w-16 text-gray-600 mx-auto" />
//             <h3 className="text-xl font-semibold text-gray-300">
//               No ideas found
//             </h3>
//             <p className="text-gray-500 max-w-md">
//               Be the first to share an innovative idea! Try adjusting your
//               filters or create a new idea to get the conversation started.
//             </p>
//             <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
//               Share Your Idea
//             </button>
//           </div>
//         </div>
//       )}

//       <ScrollToTop />

//       {bookmarkNotification && (
//         <div className="fixed bottom-4 right-4 bg-[#232323] text-green-400 px-4 py-2 rounded shadow-lg border border-green-700 z-50">
//           {bookmarkNotification}
//         </div>
//       )}

//       {showShareMsg && (
//         <div className="fixed bottom-4 left-4 bg-[#232323] text-green-400 px-4 py-2 rounded shadow-lg border border-green-700 z-50">
//           Link copied to clipboard!
//         </div>
//       )}
//     </div>
//   );
// };

// export default Ideation;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, X, Building2, Users, MapPin, TrendingUp, 
  Code, Mail, ExternalLink, Sparkles, Check, Eye, Lightbulb,
  ChevronLeft, ChevronRight, Plus, DollarSign, Heart, MessageCircle,
  Clock, Bookmark, Share2, Zap, Calendar, ArrowUpRight, Star, Tag
} from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ShinyText from "../ui/ShinyText";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../style/Ideation.css';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import LoadingSpinner from "../LoadingSpinner";

// API Configuration
const BASE_URL = 
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api/ideas"
    : "https://sfcolab-backend.onrender.com/api/ideas";

const Ideation = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedSort, setSelectedSort] = useState("trending");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [bookmarks, setBookmarks] = useState(new Set());
  
  const [alertConf, setAlertConf] = useState({title:"", message:""});
  const [loaderState, setLoaderState] = useState(false)
  
  const navigate = useNavigate();
  
  const { user, access_token, refreshToken } = useSelector((state) => state.auth);
  
  const itemsPerPage = 9;

  // Stages and industries options
  const stages = [
    "All Stages",
    "Idea Stage",
    "Concept Stage",
    "Development Stage",
    "Research Stage",
    "MVP Stage",
    "Growth Stage",
    "Scale Stage"
  ];

  const industries = [
    "All Industries",
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Manufacturing",
    "Sustainability",
    "AI & ML",
    "Blockchain",
    "E-commerce",
    "Gaming"
  ];

  const sortOptions = [
    { value: "trending", label: "Trending" },
    { value: "latest", label: "Latest" },
    { value: "popular", label: "Most Liked" },
    { value: "discussed", label: "Most Discussed" }
  ];

  // Fetch ideas with debouncing
  const fetchIdeas = async (page = 1, immediate = false) => {
    try {
      if (immediate) setLoading(true);
      // setAlertConf({title:"fetching data", message:"please wait ..."});
      const token = access_token;
      if (!token) {
        console.error('No access token found');
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        per_page: itemsPerPage.toString()
      });

      if (searchQuery) params.append('search', searchQuery);
      if (selectedStage !== 'All Stages') params.append('stage', selectedStage);
      if (selectedIndustry !== 'All Industries') params.append('industry', selectedIndustry);
      if (selectedSort === 'trending') {
        params.append('sortBy', 'likes');
        params.append('sortOrder', 'desc');
      } else if (selectedSort === 'latest') {
        params.append('sortBy', 'createdAt');
        params.append('sortOrder', 'desc');
      } else if (selectedSort === 'popular') {
        params.append('sortBy', 'likes');
        params.append('sortOrder', 'desc');
      } else if (selectedSort === 'discussed') {
        params.append('sortBy', 'comments');
        params.append('sortOrder', 'desc');
      }

      const response = await fetch(`${BASE_URL}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        const mappedIdeas = data.data.ideas.map(idea => ({
          id: idea.id || idea._id,
          title: idea.title,
          description: idea.description || "No description available.",
          stage: idea.stage,
          category: idea.industry || idea.category,
          creatorId: idea.creator_id || idea.creatorId,
          author: {
            name: `${idea.creator?.first_name || idea.creator?.firstName || "User"} ${idea.creator?.last_name || idea.creator?.lastName || ""}`.trim(),
            role: idea.creator?.position || "Contributor",
            avatar: idea.creator?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${idea.creator?.id || idea.id}`,
          },
          createdAt: new Date(idea.created_at || idea.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          timeAgo: calculateTimeAgo(idea.created_at || idea.createdAt),
          likes: idea.likes || 0,
          comments: idea.comments_count || idea.comments?.length || 0,
          collaborators: idea.team_size || idea.collaborators || 1,
          views: idea.views || 0,
          tags: Array.isArray(idea.tags) ? idea.tags : typeof idea.tags === "string" ? [idea.tags] : [],
        }));

        setIdeas(mappedIdeas);
        setTotalPages(data.data.pagination?.pages || 1);
        setCurrentPage(data.data.pagination?.page || 1);
      }
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      if (immediate) setLoading(false);
    }
  };

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    try {
      const token = access_token;
      if (!token) return;

      const response = await fetch(`${BASE_URL}/bookmarks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        const bookmarkArray = Array.isArray(data.data?.bookmarks) 
          ? data.data.bookmarks 
          : data.data?.bookmarks?.ideas || [];
        
        const bookmarkSet = new Set(bookmarkArray.map(b => b.idea_id?.toString() || b.ideaId?.toString()));
        setBookmarks(bookmarkSet);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  //! Calculate time ago
  const calculateTimeAgo = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  };

  //! Handle bookmark
  const handleBookmark = async (ideaId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoaderState(true);
    
    const token = access_token;
    if (!token) {
      alert("Please log in to bookmark ideas");
      return;
    }

    const isBookmarked = bookmarks.has(ideaId.toString());
    const newBookmarks = new Set(bookmarks);
    
    try {
      const response = await fetch(`${BASE_URL}/${ideaId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        if (isBookmarked) {
          newBookmarks.delete(ideaId.toString());
        } else {
          newBookmarks.add(ideaId.toString());
        }
        setBookmarks(newBookmarks);
        setLoaderState(false);
        
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  //! Handle like
  const handleLike = async (ideaId, e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = access_token;
    if (!token) {
      alert("Please log in to like ideas");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/${ideaId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        // Update local state
        setIdeas(prev => prev.map(idea => 
          idea.id === ideaId 
            ? { ...idea, likes: idea.likes + 1 }
            : idea
        ));
      }
    } catch (error) {
      console.error('Error liking idea:', error);
    }
  };

  //! Handle create idea
  const handleCreateIdea = async (formData) => {
    const token = access_token;
    if (!token) {
      alert("Please log in to create ideas");
      return;
    }
    
    setLoaderState(true);
    setAlertConf({title:"Creating Idea", message:"Please wait..."});
    
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          project_details: formData.projectDetails,
          industry: formData.industry,
          stage: formData.stage,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          creator_id: user?.id,
          creator_first_name: user?.first_name,
          creator_last_name: user?.last_name
        })
      });

      const data = await response.json();
      if (data.success) {
        const newIdea = {
          id: data.data.idea.id,
          title: formData.title,
          description: formData.description,
          stage: formData.stage,
          category: formData.industry,
          author: {
            name: `${user?.first_name} ${user?.last_name}`,
            role: user?.position || "Creator",
            avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`
          },
          timeAgo: "just now",
          likes: 0,
          comments: 0,
          collaborators: 1,
          views: 0,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        setIdeas(prev => [newIdea, ...prev]);
        setShowCreateModal(false);
        setLoaderState(false);
        
      }
    } catch (error) {
      console.error('Error creating idea:', error);
      alert('Failed to create idea. Please try again.');
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIdeas(1, true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedStage, selectedIndustry, selectedSort]);

  // Initial load
  useEffect(() => {
    fetchIdeas(1, true);
    fetchBookmarks();
  }, []);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStage("All Stages");
    setSelectedIndustry("All Industries");
    setSelectedSort("trending");
  };

  const activeFiltersCount = [
    selectedStage !== "All Stages",
    selectedIndustry !== "All Industries",
    searchQuery !== "",
    selectedSort !== "trending"
  ].filter(Boolean).length;

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

  const handleIdeaClick = (idea) => {
    navigate(`/ideation-details?id=${idea.id}`);
  };

  return (
    <div className="min-h-screen">
      {/* Animated Background Elements */}
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
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-10 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl"
        />
      </div>
      
      {/* Loader Overlay */}
      {loaderState && (
        <LoadingSpinner
          title={alertConf.title || "Authenticating..."}
          message={alertConf.message || "Please wait while we redirect you."}
        />
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-2">
        {/* Navigation */}
        <motion.nav 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50 mb-8"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-6 backdrop-blur-sm"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                <span className="text-xs flex items-center font-medium bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  <img src="/rocket.png" className="w-7" alt="Ideation Hub"/> {ideas.length}+ Active Ideas
                </span>
              </motion.div>
              
              <div className="hidden md:flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-300 hover:text-black"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Share Idea
                </Button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Header */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{minHeight:'70vh'}}
          className="text-center mb-2 pb-2 relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 12, repeat: Infinity }}
              className="absolute bottom-10 left-1/4 w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl"
            />
          </div>
          
          {/* Main Heading */}
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="">
              <ShinyText 
                text="Where Ideas" 
                disabled={false} 
                speed={3} 
              />
            </span>
            <br />
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ShinyText 
                text="Become Innovations" 
                disabled={false} 
                speed={3} 
                className='custom-title' 
              />
            </motion.span>
          </motion.h1>
          
          {/* Subheading */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            Join <span className="font-semibold text-white">thousands of innovators</span> sharing, discussing, and collaborating on groundbreaking ideas. 
            From concept to scale, find your next big project.
          </motion.p>
          
          {/* Stats Grid */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{ideas.length}+</div>
              <div className="text-sm text-gray-400">Active Ideas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">5.2K+</div>
              <div className="text-sm text-gray-400">Collaborators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">94%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">24h</div>
              <div className="text-sm text-gray-400">Avg. Response</div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-gray-400 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Search & Mobile Filter Toggle */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex gap-3"
        >
          {/* Mobile Filter Toggle */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden h-12 relative border-gray-600 bg-gray-800 text-gray-300">
                <Filter className="w-5 h-5" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto bg-gray-800 border-gray-700">
              <MobileFilterSidebar
                industries={industries}
                stages={stages}
                sortOptions={sortOptions}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedIndustry={selectedIndustry}
                setSelectedIndustry={setSelectedIndustry}
                selectedStage={selectedStage}
                setSelectedStage={setSelectedStage}
                selectedSort={selectedSort}
                setSelectedSort={setSelectedSort}
                clearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
              />
            </SheetContent>
          </Sheet>
        </motion.div>

        {/* Desktop Filters Sidebar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden md:block shrink-0 w-full mb-8"
        >
          <div className="w-full">
            <FilterSidebar
              industries={industries}
              stages={stages}
              sortOptions={sortOptions}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedIndustry={selectedIndustry}
              setSelectedIndustry={setSelectedIndustry}
              selectedStage={selectedStage}
              setSelectedStage={setSelectedStage}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
              clearFilters={clearFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </div>
        </motion.div>

        {/* Ideas Grid */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {ideas.length} {ideas.length === 1 ? 'idea' : 'ideas'} found
          </p>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-400 hover:text-white">
              Clear all filters
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <IdeaCardSkeleton key={i} />
              ))}
            </div>
          ) : ideas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl flex items-center justify-center mb-4">
                <Lightbulb className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No ideas found</h3>
              <p className="text-gray-400 mb-6 text-center max-w-md">
                Try adjusting your filters or be the first to share an innovative idea!
              </p>
              <Button onClick={() => setShowCreateModal(true)} variant="outline" className="border-gray-600 text-gray-300">
                <Plus className="w-4 h-4 mr-2" />
                Share Your First Idea
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {ideas.map((idea, index) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  index={index}
                  onClick={() => handleIdeaClick(idea)}
                  onBookmark={(e) => handleBookmark(idea.id, e)}
                  onLike={(e) => handleLike(idea.id, e)}
                  isBookmarked={bookmarks.has(idea.id.toString())}
                  getStageColor={getStageColor}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchIdeas(currentPage - 1, true)}
              disabled={currentPage === 1}
              className="border-gray-600 text-gray-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = currentPage <= 3 
                ? i + 1 
                : currentPage >= totalPages - 2 
                  ? totalPages - 4 + i 
                  : currentPage - 2 + i;
              if (page < 1 || page > totalPages) return null;
              
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => fetchIdeas(page, true)}
                  className={currentPage === page 
                    ? "bg-blue-500 hover:bg-blue-600" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                  }
                >
                  {page}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchIdeas(currentPage + 1, true)}
              disabled={currentPage === totalPages}
              className="border-gray-600 text-gray-300"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Create Idea Modal */}
      {showCreateModal && (
        <CreateIdeaModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateIdea}
          industries={industries.filter(ind => ind !== "All Industries")}
          stages={stages.filter(stage => stage !== "All Stages")}
        />
      )}
    </div>
  );
};

// Desktop Filter Sidebar Component
const FilterSidebar = ({
  industries,
  stages,
  sortOptions,
  searchQuery,
  setSearchQuery,
  selectedIndustry,
  setSelectedIndustry,
  selectedStage,
  setSelectedStage,
  selectedSort,
  setSelectedSort,
  clearFilters,
  activeFiltersCount
}) => (
  <Card className="p-6 bg-transparent border-0 w-full">
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Search Bar */}
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Search</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-700 border-gray-600 text-white w-full"
            style={{ minWidth: '200px' }}
          />
        </div>
      </div>

      {/* Industry Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">Industry</h4>
        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <SelectTrigger style={{width:'150px'}} className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="All Industries" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {industries.map(industry => (
              <SelectItem key={industry} value={industry} className="text-white hover:bg-gray-700">
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stage Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">Stage</h4>
        <Select value={selectedStage} onValueChange={setSelectedStage}>
          <SelectTrigger style={{width:'150px'}} className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {stages.map(stage => (
              <SelectItem key={stage} value={stage} className="text-white hover:bg-gray-700">
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">Sort By</h4>
        <Select value={selectedSort} onValueChange={setSelectedSort}>
          <SelectTrigger style={{width:'150px'}} className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters Button */}
      {activeFiltersCount > 0 && (
        <div className="flex items-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters} 
            className="text-blue-400 hover:text-blue-300 text-xs h-8"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  </Card>
);

// Mobile Filter Sidebar Component
const MobileFilterSidebar = ({
  industries,
  stages,
  sortOptions,
  searchQuery,
  setSearchQuery,
  selectedIndustry,
  setSelectedIndustry,
  selectedStage,
  setSelectedStage,
  selectedSort,
  setSelectedSort,
  clearFilters,
  activeFiltersCount
}) => (
  <div className="space-y-6 pt-10">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-white">Filters</h3>
      {activeFiltersCount > 0 && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-blue-400 hover:text-blue-300 text-xs">
          Clear all
        </Button>
      )}
    </div>

    {/* Search */}
    <div>
      <h4 className="text-sm font-medium text-gray-300 mb-2">Search</h4>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search ideas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-gray-700 border-gray-600 text-white"
        />
      </div>
    </div>

    {/* Industry */}
    <div>
      <h4 className="text-sm font-medium text-gray-300 mb-2">Industry</h4>
      <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
        <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
          <SelectValue placeholder="All Industries" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-600">
          {industries.map(industry => (
            <SelectItem key={industry} value={industry} className="text-white hover:bg-gray-700">
              {industry}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Stage */}
    <div>
      <h4 className="text-sm font-medium text-gray-300 mb-2">Stage</h4>
      <Select value={selectedStage} onValueChange={setSelectedStage}>
        <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
          <SelectValue placeholder="All Stages" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-600">
          {stages.map(stage => (
            <SelectItem key={stage} value={stage} className="text-white hover:bg-gray-700">
              {stage}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Sort */}
    <div>
      <h4 className="text-sm font-medium text-gray-300 mb-2">Sort By</h4>
      <Select value={selectedSort} onValueChange={setSelectedSort}>
        <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-600">
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

// Idea Card Component
const IdeaCard = ({ idea, index, onClick, onBookmark, onLike, isBookmarked, getStageColor }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ delay: index * 0.05 }}
  >
    <Card 
      className="group p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-700 bg-gray-800/50 backdrop-blur-sm overflow-hidden relative hover:border-blue-500/50"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-600/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:via-blue-600/5 group-hover:to-purple-500/5 transition-all duration-300" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={idea.author.avatar}
                alt={idea.author.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-gray-700"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white">{idea.author.name}</h3>
              <p className="text-xs text-gray-400">{idea.author.role}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(idea.stage)}`}>
              {idea.stage}
            </span>
            <button
              onClick={onBookmark}
              className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
            {idea.title}
          </h2>
          
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {idea.description}
          </p>

          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {idea.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-lg"
                >
                  #{tag}
                </span>
              ))}
              {idea.tags.length > 3 && (
                <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-lg">
                  +{idea.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-700">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <button
              onClick={onLike}
              className="flex items-center gap-1 hover:text-red-400 transition-colors"
            >
              <Heart className="w-4 h-4" />
              {idea.likes}
            </button>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {idea.comments}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {idea.collaborators}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {idea.views}
            </span>
          </div>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {idea.timeAgo}
          </span>
        </div>
      </div>
    </Card>
  </motion.div>
);

// Create Idea Modal Component
const CreateIdeaModal = ({ onClose, onSubmit, industries, stages }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectDetails: "",
    industry: "Technology",
    stage: "Idea Stage",
    tags: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      style={{zIndex:9999999}}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent 
      style={{zIndex:99999999}}
        
          className="sm:max-w-[600px] bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-black/40 max-h-[90vh] overflow-y-auto scroll-smooth hide-scrollbar"
        >
          <form className="relative" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-white  text-2xl font-bold">Share Your Idea</DialogTitle>
              <DialogDescription className="text-gray-400 text-sm">
                Inspire others with your innovation
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Idea Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="What's your big idea?"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your idea in detail. What problem does it solve? How does it work?"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Details
                </label>
                <textarea
                  value={formData.projectDetails}
                  onChange={(e) => setFormData({...formData, projectDetails: e.target.value})}
                  placeholder="Add technical details, business model, implementation plan..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Industry *
                  </label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData({...formData, industry: value})}
                  >
                    <SelectTrigger style={{zIndex:9999999999}} className="w-full bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select Industry" />
                    </SelectTrigger>
                    <SelectContent style={{zIndex:99999999999}}  className="bg-gray-900 border-gray-700">
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry} className="text-white hover:bg-gray-800 hover:text-white cursor-pointer">
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stage *
                  </label>
                  <Select
                    value={formData.stage}
                    onValueChange={(value) => setFormData({...formData, stage: value})}
                  >
                    <SelectTrigger style={{zIndex:9999999999}} className="w-full bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select Stage" />
                    </SelectTrigger>
                    <SelectContent  style={{zIndex:99999999999}} className="bg-gray-900 border-gray-700">
                      {stages.map(stage => (
                        <SelectItem  key={stage} value={stage} className="text-white hover:bg-gray-800 hover:text-white cursor-pointer">
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="e.g., AI, Mobile, Sustainability (comma separated)"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <DialogFooter className="mt-6 ">
              <DialogClose  asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="text-gray-400 bg-red-500/50 h-8.5 hover:bg-red-500/70 hover:shadow-[0px_0px_10px_red] hover:text-white cursor-pointer transition-all duration-800"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit"
                className="h-8.5 bg-white hover:bg-white text-black hover:scale-102 hover:shadow-[0px_0px_10px_white] cursor-pointer transition-all duration-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Share Idea
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

// Skeleton Loading Component
const IdeaCardSkeleton = () => (
  <Card className="p-6 border-gray-700">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-700 rounded-xl"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-24"></div>
          <div className="h-3 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
      <div className="h-6 bg-gray-700 rounded w-16"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-6 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 bg-gray-700 rounded w-16"></div>
      <div className="h-6 bg-gray-700 rounded w-20"></div>
    </div>
    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
      <div className="flex gap-4">
        <div className="h-3 bg-gray-700 rounded w-12"></div>
        <div className="h-3 bg-gray-700 rounded w-12"></div>
        <div className="h-3 bg-gray-700 rounded w-12"></div>
      </div>
      <div className="h-3 bg-gray-700 rounded w-16"></div>
    </div>
  </Card>
);

export default Ideation;