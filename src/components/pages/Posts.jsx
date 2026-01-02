import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  X,
  ImageIcon,
  Video,
  Send,
  Upload,
  Sparkles,
  ChevronRight,
  Eye,
  Heart,
  ArrowUp,
  Grid3X3,
  Home,
  Search,
  Plus,
  User,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import StoryModal from "../modal/StoryModal";
import StoryViewerModal from "../modal/StoryViewerModal";

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

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const iconVariants = {
  idle: { scale: 1 },
  tap: { scale: 0.9 },
  hover: { scale: 1.1, rotate: [0, -10, 10, 0], transition: { duration: 0.3 } },
};
const stories = [
  {
    id: 1,
    name: "Mike",
    avatar: "https://i.pravatar.cc/150?img=1",
    thumbnail: "https://picsum.photos/seed/workspace/400/260",
    type: "image",
  },
  {
    id: 2,
    name: "Emma",
    avatar: "https://i.pravatar.cc/150?img=2",
    thumbnail: "https://picsum.photos/seed/office/400/260",
    type: "image",
  },
  {
    id: 3,
    name: "Alex",
    avatar: "https://i.pravatar.cc/150?img=8",
    thumbnail: "https://picsum.photos/seed/design/400/260",
    type: "image",
  },
  {
    id: 4,
    name: "Maya",
    avatar: "https://i.pravatar.cc/150?img=9",
    thumbnail: "https://picsum.photos/seed/app/400/260",
    type: "image",
  },
  {
    id: 5,
    name: "Ava",
    avatar: "https://i.pravatar.cc/150?img=9",
    thumbnail:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    type: "video",
  },
];

const Stories = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-4 border border-zinc-800/50 mb-6 mt-10">
      <div className="flex gap-4">
        {/* Add Story Card */}
        <div className="relative min-w-[120px] h-[120px] rounded-xl overflow-hidden border border-dashed border-zinc-700 bg-[url('https://picsum.photos/seed/addstory/400/260')] bg-cover bg-center">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-zinc-400 hover:text-blue-400 transition">
            <button
              onClick={() => setIsOpen(true)}
              className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center mb-2"
            >
              <Plus size={18} />
            </button>
            <span className="text-xs font-medium">Add Story</span>
          </div>
        </div>
        {/* Stories modal */}
        <StoryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        {/* Scrollable Stories */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {stories.map((story, index) => (
            <div
              key={story.id}
              onClick={() => {
                setActiveIndex(index);
                setViewerOpen(true);
              }}
              className="group relative min-w-[120px] h-[120px] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition"
            >
              {/* Thumbnail */}
              <img
                src={story.thumbnail}
                alt={story.name}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* User */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                <Avatar className="w-7 h-7 border border-white/20">
                  <AvatarImage src={story.avatar} />
                  <AvatarFallback>{story.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-white font-medium truncate">
                  {story.name}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* status view */}
        <StoryViewerModal
          isOpen={viewerOpen}
          stories={stories}
          startIndex={activeIndex}
          onClose={() => setViewerOpen(false)}
        />
      </div>
    </div>
  );
};

// Left Sidebar Component - NEW
const LeftSidebar = () => {
  const menuItems = [
    { icon: Home, label: "Feed", active: true },
    { icon: Search, label: "Explore", active: false },
    { icon: Heart, label: "My Favorites", active: false },
    { icon: Send, label: "Direct", active: false },
    { icon: Video, label: "16 TV", active: false },
    { icon: BarChart3, label: "Stats", active: false },
    { icon: Settings, label: "Setting", active: false },
  ];

  const suggestions = [
    {
      name: "Webulsylist",
      location: "Elk Grove, California",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      name: "Anghelina",
      location: "Sibiu, Romania",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
    {
      name: "Male Designer",
      location: "Ukraine",
      avatar: "https://i.pravatar.cc/150?img=14",
    },
    {
      name: "Vera Cherry",
      location: "Bremen, Germany",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    {
      name: "Josh e-Sport",
      location: "Elk Grove, California",
      avatar: "https://i.pravatar.cc/150?img=16",
    },
  ];

  return (
    <div className="w-80 space-y-2">
      {/* Profile Card */}
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-16 h-16 ring-2 ring-blue-400/50">
              <AvatarImage src="https://i.pravatar.cc/150?img=7" />
              <AvatarFallback>LT</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-white">Masudur Rahman</h3>
              <p className="text-sm text-zinc-400">Bremen, Germany</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="font-bold text-white">28.5k</p>
              <p className="text-xs text-zinc-400">Likes</p>
            </div>
            <div>
              <p className="font-bold text-white">33</p>
              <p className="text-xs text-zinc-400">Comment</p>
            </div>
            <div>
              <p className="font-bold text-white">134</p>
              <p className="text-xs text-zinc-400">Share</p>
            </div>
          </div>

          <Button className="w-full bg-gradient-to-br from-gray-600 to-black text-gray-200 hover:from-gray-800 hover:to-gray-400 hover:cursor-pointer">
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50">
        <CardContent className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.label}
                variant="ghost"
                className={`w-full justify-start mb-2 ${
                  item.active
                    ? "bg-gray-700 text-white border-blue-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50">
        <CardHeader>
          <h3 className="font-semibold text-white">Suggestions for you</h3>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {suggestions.map((user) => (
              <div
                key={user?.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-zinc-400">{user?.location}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-blue-400/50 text-gray-200 bg-gray-900 hover:bg-gray-700 hover:text-white hover:cursor-pointer"
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Right Sidebar Component - NEW
const RightSidebar = () => {
  const trending = [
    { hashtag: "#WebDevelopment", posts: "24.3K" },
    { hashtag: "#ReactJS", posts: "18.7K" },
    { hashtag: "#UIUX", posts: "12.4K" },
    { hashtag: "#Startup", posts: "9.8K" },
  ];

  return (
    <div className="w-80 space-y-2 ">
      {/* Search */}
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
            />
            <Input
              placeholder="Search..."
              className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Trending Feeds */}
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Trending Feeds</h3>
            <Badge
              variant="outline"
              className="border-blue-400/50 text-blue-400 bg-blue-500/10"
            >
              Hot
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {trending.map((trend, index) => (
              <div
                key={trend.hashtag}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-black rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {trend.hashtag}
                    </p>
                    <p className="text-xs text-zinc-400">{trend.posts} posts</p>
                  </div>
                </div>
                <MoreHorizontal size={16} className="text-zinc-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Activity */}
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50">
        <CardHeader>
          <h3 className="font-semibold text-white">Profile Activity</h3>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-black rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-white">24.3K</span>
            </div>
            <p className="text-sm text-zinc-400">Follower</p>
          </div>

          <div className="bg-zinc-800/30 rounded-lg p-4">
            <p className="text-sm text-blue-300 font-medium mb-2">
              Active now on your profile
            </p>
            <p className="text-xs text-zinc-400">
              Apply for a feature following the link in our bio and we will
              publish your photos in our account: @travelsfever
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Online Friends */}
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50">
        <CardHeader>
          <h3 className="font-semibold text-white">Active Now</h3>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="relative">
                  <Avatar className="w-12 h-12 border-2 border-green-500">
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?img=${i + 20}`}
                    />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                </div>
                <p className="text-xs text-zinc-400 mt-1">User{i}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// MultiImageGrid Component - UPDATED
const MultiImageGrid = ({ images, onImageClick }) => {
  const getGridClass = (count) => {
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2 gap-1";
      case 3:
        return "grid-cols-2 gap-1";
      case 4:
        return "grid-cols-2 gap-1";
      default:
        return "grid-cols-3 gap-1";
    }
  };

  const renderImages = () => {
    const imageCount = images.length;

    if (imageCount === 1) {
      return (
        <div
          className="relative group cursor-pointer"
          onClick={() => onImageClick(images[0])}
        >
          <img
            src={images[0]}
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
      );
    }

    return (
      <div
        className={`grid ${getGridClass(
          imageCount
        )} rounded-xl overflow-hidden`}
      >
        {images.slice(0, 9).map((image, index) => (
          <div
            key={index}
            className={`relative group cursor-pointer ${
              imageCount === 3 && index === 0 ? "col-span-2 row-span-2" : ""
            } ${imageCount === 4 ? "aspect-square" : ""}`}
            onClick={() => onImageClick(image)}
          >
            <img
              src={image}
              alt={`Post content ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {imageCount > 4 && index === 3 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  +{imageCount - 4}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative">
      {images.length > 1 && (
        <div className="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur-sm rounded-full p-2">
          <Grid3X3 size={16} className="text-white" />
        </div>
      )}
      {renderImages()}
    </div>
  );
};

// Media Viewer Sheet Component
const MediaViewerSheet = ({
  mediaUrl,
  mediaType,
  trigger,
  isMultiImage = false,
  images = [],
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isMultiImage && images.length > 0) {
    return (
      <Sheet>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent
          style={{ zIndex: 999999999 }}
          side="bottom"
          className="h-[90vh] bg-black/25 backdrop-blur-xl border-white/10"
        >
          <SheetHeader>
            <SheetTitle className="text-white flex items-center gap-2">
              <ShinyText>Media Preview</ShinyText>
              <Badge
                variant="outline"
                className="border-blue-300/50 text-blue-300 bg-blue-500/10"
              >
                {currentImageIndex + 1} / {images.length}
              </Badge>
            </SheetTitle>
          </SheetHeader>
          <div className="flex items-center justify-center h-full relative">
            <img
              src={images[currentImageIndex]}
              alt={`Gallery ${currentImageIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded-lg"
            />

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm border-white/20"
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev - 1 + images.length) % images.length
                    )
                  }
                  disabled={images.length <= 1}
                >
                  <ChevronRight size={24} className="rotate-180 text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm border-white/20"
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev + 1) % images.length)
                  }
                  disabled={images.length <= 1}
                >
                  <ChevronRight size={24} className="text-white" />
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[95vh] bg-black/95 backdrop-blur-xl border-white/10"
      >
        <SheetHeader>
          <SheetTitle className="text-white">
            <ShinyText>Media Preview</ShinyText>
          </SheetTitle>
        </SheetHeader>
        <div className="flex items-center justify-center h-full">
          {mediaType === "image" ? (
            <img
              src={mediaUrl}
              alt="Full preview"
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          ) : (
            <video
              src={mediaUrl}
              controls
              className="max-h-full max-w-full rounded-lg"
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Comment Dialog Component
const CommentDialog = ({ comments, postAuthor }) => {
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState([
    {
      id: 1,
      author: "Alex Chen",
      avatar: "https://i.pravatar.cc/150?img=8",
      text: "This is amazing! Great work!",
      timestamp: "1h ago",
    },
    {
      id: 2,
      author: "Maya Patel",
      avatar: "https://i.pravatar.cc/150?img=9",
      text: "Love the attention to detail here.",
      timestamp: "2h ago",
    },
  ]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setCommentList([
      {
        id: commentList.length + 1,
        author: "You",
        avatar: "https://i.pravatar.cc/150?img=7",
        text: newComment,
        timestamp: "Just now",
      },
      ...commentList,
    ]);
    setNewComment("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
        >
          <MessageCircle size={18} />
          <span className="text-xs font-medium">{comments}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            <ShinyText className="text-xl">Comments</ShinyText>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {commentList.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3"
              >
                <Avatar className="w-8 h-8 ring-2 ring-blue-500/20">
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback>{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-3 border border-zinc-800/50">
                    <p className="text-sm font-semibold text-white">
                      {comment.author}
                    </p>
                    <p className="text-sm text-zinc-300 mt-1">{comment.text}</p>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 ml-3">
                    {comment.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2 pt-4 border-t border-zinc-800/50">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:ring-blue-500/50 resize-none"
            rows={2}
          />
          <Button
            onClick={handleAddComment}
            className="bg-blue-600 hover:bg-blue-700 self-end"
            size="icon"
          >
            <Send size={18} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
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

// Post Actions Component
const PostActions = ({ post, liked, setLiked, bookmarked, setBookmarked }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLiked(!liked)}
                  className={`gap-2 transition-all ${
                    liked
                      ? "text-pink-500 bg-pink-500/10 hover:bg-pink-500/20"
                      : "text-zinc-400 hover:text-pink-400 hover:bg-pink-500/10"
                  }`}
                >
                  <Heart size={18} className={liked ? "fill-pink-500" : ""} />
                  <span className="text-xs font-medium">
                    {post.likes + (liked ? 1 : 0)}
                  </span>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>Like</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <CommentDialog comments={post.comments} postAuthor={post.author} />
        <ShareSheet />
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBookmarked(!bookmarked)}
                className={`gap-2 transition-all ${
                  bookmarked
                    ? "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"
                    : "text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10"
                }`}
              >
                <Bookmark
                  size={18}
                  className={bookmarked ? "fill-blue-400" : ""}
                />
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>Save</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

// Post Card Component
const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const hasMultipleImages =
    post.type === "image" &&
    Array.isArray(post.mediaUrl) &&
    post.mediaUrl.length > 1;

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
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm text-white">
                  {post.author.name}
                </p>
                <p className="text-xs text-zinc-400">{post.timestamp}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <MoreHorizontal size={18} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {post.caption && (
            <p
              className={`text-zinc-300 leading-relaxed ${
                post.type === "text" ? "text-base" : "text-sm"
              }`}
            >
              {post.caption}
            </p>
          )}

          {post.type !== "text" && (
            <MediaViewerSheet
              mediaUrl={hasMultipleImages ? post.mediaUrl[0] : post.mediaUrl}
              mediaType={post.type}
              images={hasMultipleImages ? post.mediaUrl : []}
              isMultiImage={hasMultipleImages}
              trigger={
                <motion.div
                  className="relative group cursor-pointer"
                  whileHover={{ scale: hasMultipleImages ? 1.02 : 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {post.type === "image" ? (
                    hasMultipleImages ? (
                      <MultiImageGrid
                        images={post.mediaUrl}
                        onImageClick={(image) =>
                          console.log("Image clicked:", image)
                        }
                      />
                    ) : (
                      <div className="relative rounded-xl overflow-hidden">
                        <img
                          src={post.mediaUrl}
                          alt="Post content"
                          className="w-full h-auto max-h-[500px] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="flex items-center gap-2 text-white">
                            <Eye size={20} />
                            <span className="text-sm font-medium">
                              View Full
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <video
                      src={post.mediaUrl}
                      className="w-full rounded-xl"
                      controls
                    />
                  )}
                </motion.div>
              }
            />
          )}

          <Separator className="bg-zinc-800/50" />

          <PostActions
            post={post}
            liked={liked}
            setLiked={setLiked}
            bookmarked={bookmarked}
            setBookmarked={setBookmarked}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Create Post Component
const CreatePost = ({ currentUser, onPost }) => {
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState([]);
  const [fileType, setFileType] = useState(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleFileChange = (e, type) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    const fileUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setFiles((prev) => [...prev, ...fileUrls]);
    setFileType(type);
  };

  const handlePost = () => {
    if (!caption.trim() && !files.length) return;

    const postType = files.length > 1 ? "image" : fileType || "text";

    onPost({
      caption,
      files,
      type: postType,
      isMultiImage: files.length > 1,
    });

    setCaption("");
    setFiles([]);
    setFileType(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAllFiles = () => {
    setFiles([]);
    setFileType(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  return (
    <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50 shadow-xl overflow-hidden">
      <CardHeader>
        <h2 className="text-lg font-bold">
          <ShinyText>Create Post</ShinyText>
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10 ring-2 ring-blue-400/50">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
          </Avatar>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-1 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none min-h-[80px]"
          />
        </div>

        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">
                  {files.length} {files.length === 1 ? "file" : "files"}{" "}
                  selected
                </p>
                <Button
                  onClick={removeAllFiles}
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-red-400 text-xs"
                >
                  Remove all
                </Button>
              </div>

              {files.length === 1 ? (
                <div className="relative rounded-xl overflow-hidden">
                  {fileType === "image" ? (
                    <img
                      src={files[0]}
                      alt="Preview"
                      className="max-h-80 w-full object-contain rounded-xl"
                    />
                  ) : (
                    <video
                      src={files[0]}
                      controls
                      className="max-h-80 w-full rounded-xl"
                    />
                  )}
                  <Button
                    onClick={() => removeFile(0)}
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 backdrop-blur-sm"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <MultiImageGrid
                  images={files}
                  onImageClick={(image) => console.log("Preview image:", image)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Separator className="bg-zinc-800/50" />

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => imageInputRef.current?.click()}
                    className="text-zinc-400 hover:text-green-400 hover:bg-green-500/10"
                  >
                    <ImageIcon size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Images</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => videoInputRef.current?.click()}
                    className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Video size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Video</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Button
            onClick={handlePost}
            disabled={!caption.trim() && !files.length}
            className="bg-gradient-to-br from-gray-600 to-black text-gray-200 hover:from-gray-800 hover:to-gray-400 hover:cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-600 gap-2 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles
                size={16}
                className="group-hover:rotate-12 transition-transform"
              />
              Post
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity bg-[length:200%_100%] animate-shimmer" />
          </Button>
        </div>

        <input
          type="file"
          ref={imageInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={(e) => handleFileChange(e, "image")}
        />
        <input
          type="file"
          ref={videoInputRef}
          className="hidden"
          accept="video/*"
          onChange={(e) => handleFileChange(e, "video")}
        />
      </CardContent>
    </Card>
  );
};

// Main Posts Component - UPDATED WITH 3-CELL GRID
const Posts = () => {
  const currentUser = {
    name: "Lipp Tom",
    avatar: "https://i.pravatar.cc/150?img=7",
  };

  const initialPosts = [
    {
      id: 1,
      author: {
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      timestamp: "2 hours ago",
      type: "image",
      mediaUrl: [
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=500&auto=format&fit=crop",
      ],
      caption:
        "Project development progress shots! Multiple angles of our new interface design. 💡 #devlife #uiux",
      likes: 128,
      comments: 12,
    },
    {
      id: 2,
      author: { name: "Mike Chen", avatar: "https://i.pravatar.cc/150?img=1" },
      timestamp: "5 hours ago",
      type: "image",
      mediaUrl: [
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=500&auto=format&fit=crop",
      ],
      caption:
        "Team brainstorming session today. Before and after shots of our workspace setup!",
      likes: 256,
      comments: 23,
    },
    {
      id: 3,
      author: { name: "Emma Davis", avatar: "https://i.pravatar.cc/150?img=2" },
      timestamp: "1 day ago",
      type: "video",
      mediaUrl:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      caption:
        "A quick look at our new office space! Loving the vibe here. #office #startupgrind",
      likes: 312,
      comments: 41,
    },
  ];

  const [posts, setPosts] = useState(initialPosts);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleCreatePost = (postData) => {
    if (postData && (postData.files?.length || postData.caption)) {
      const newPost = {
        id: posts.length + 1,
        author: currentUser,
        timestamp: "Just now",
        caption: postData.caption,
        likes: 0,
        comments: 0,
        type: postData.type,
        mediaUrl:
          postData.files?.length > 1
            ? postData.files
            : postData.files?.[0] || null,
      };
      setPosts([newPost, ...posts]);
    }
  };

  return (
    <div className="min-h-screen  text-white w-full">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        <div className="absolute top-1/4 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute top-1/3 -right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main 3-Cell Grid Layout */}
      <div className="relative w-full mx-auto px-3  ">
        <div className="grid grid-cols-12  gap-4">
          {/* ---- LEFT SIDEBAR (hidden on mobile, sticky on lg) ---- */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-0 space-y-2">
              <LeftSidebar />
            </div>
          </div>

          {/* ---- CENTER FEED (full width on mobile, 6 cols on lg) ---- */}
          <div className="col-span-12  lg:col-span-6">
            <div className="space-y-6">
              {/* Stories */}
              <Stories />

              {/* Create Post */}
              <CreatePost currentUser={currentUser} onPost={handleCreatePost} />

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
          <div className="hidden lg:block lg:col-span-3 ">
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

// Add missing icons
const BarChart3 = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
  >
    <path d="M18 20V10" />
    <path d="M12 20V4" />
    <path d="M6 20v-6" />
  </svg>
);

const Settings = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default Posts;
