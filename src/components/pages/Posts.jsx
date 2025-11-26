import React, { useState, useRef } from 'react';
import { ThumbsUp, MessageCircle, Share2, Bookmark, MoreHorizontal, X, Image as ImageIcon, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <motion.div
      className="bg-[#2A2A2A] rounded-2xl overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-sm">{post.author.name}</p>
            <p className="text-xs text-zinc-400">{post.timestamp}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Media */}
      {post.type !== 'text' && (
        <div>
            {post.type === 'image' ? (
            <img src={post.mediaUrl} alt="Post content" className="w-full object-cover" />
            ) : (
            <video src={post.mediaUrl} controls className="w-full"></video>
            )}
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={() => setLiked(!liked)} className="flex items-center gap-2 text-zinc-400 hover:text-pink-500 transition-colors duration-300">
              <ThumbsUp size={20} className={`transition-all duration-300 ${liked ? 'text-pink-500 fill-pink-500' : ''}`} />
              <span className="text-xs font-medium">{post.likes + (liked ? 1 : 0)} Likes</span>
            </button>
            <button className="flex items-center gap-2 text-zinc-400 hover:text-green-500 transition-colors duration-300">
              <MessageCircle size={20} />
              <span className="text-xs font-medium">{post.comments} Comments</span>
            </button>
            <button className="flex items-center gap-2 text-zinc-400 hover:text-blue-500 transition-colors duration-300">
              <Share2 size={20} />
              <span className="text-xs font-medium">Share</span>
            </button>
          </div>
          <button onClick={() => setBookmarked(!bookmarked)} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-300">
            <Bookmark size={20} className={`transition-all duration-300 ${bookmarked ? 'text-white fill-white' : ''}`} />
            <span className="text-xs font-medium">Save</span>
          </button>
        </div>
        {post.caption && (
            <p className={`text-sm mt-1 ${post.type === 'text' ? 'text-lg' : ''}`}>
                {post.type !== 'text' && (
                    <span className="font-semibold cursor-pointer hover:underline">{post.author.name}</span>
                )}
                <span className={`text-gray-300 ${post.type !== 'text' ? 'ml-2' : ''}`}>{post.caption}</span>
            </p>
        )}
      </div>
    </motion.div>
  );
};

const CreatePost = ({ currentUser, onPost }) => {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null); // Will store the blob URL
  const [fileType, setFileType] = useState(null); // 'image' or 'video'
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile));
      setFileType(selectedFile.type.startsWith('video') ? 'video' : 'image');
    }
  };

  const handlePost = () => {
    if (!caption.trim() && !file) return;
    onPost({ caption, file, type: file ? fileType : 'text' });
    setCaption('');
    setFile(null);
    setFileType(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
    Swal.fire({
      title: 'Success!',
      text: 'Your post has been published successfully!',
      icon: 'success',
      background: '#1E1E1E',
      color: '#FFFFFF'
    });
  };

  const removeFile = () => {
    setFile(null);
    setFileType(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  return (
    <div className="bg-[#2A2A2A] p-4 rounded-2xl shadow-lg shadow-black/20" 
         onFocus={() => setIsFocused(true)} 
         onBlur={() => setIsFocused(false)}>
      <h2 className="text-xl font-bold mb-4">Create a Post</h2>
      <div className="flex gap-4">
        <img src={currentUser.avatar} alt="current user" className="w-10 h-10 rounded-full" />
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-[#1E1E1E] border border-transparent rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
          rows="2"
        />
      </div>

      {file && (
        <div className="mt-4 relative">
          {fileType === 'image' ? (
            <img src={file} alt="Preview" className="max-h-80 w-full object-contain rounded-lg" />
          ) : (
            <video src={file} controls className="max-h-80 w-full rounded-lg"></video>
          )}
          <button onClick={removeFile} className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/75 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="overflow-hidden">
        <hr className="border-white/10 my-3" />
        <div className="flex justify-between items-center">
          <div className="flex gap-2 text-sm">
            <button onClick={() => imageInputRef.current?.click()} className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors text-zinc-400">
              <ImageIcon className="text-green-500" size={20} />
            </button>
            <button onClick={() => videoInputRef.current?.click()} className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors text-zinc-400">
              <Video className="text-red-500" size={20} />
            </button>
          </div>
          <button onClick={handlePost} disabled={!caption.trim() && !file} className="bg-[#3B82F6] hover:bg-blue-700 disabled:bg-blue-800/50 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-semibold text-sm text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            Post
          </button>
        </div>
      </div>
      <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
    </div>
  );
};

const Posts = () => {
  const currentUser = { 
    name: 'Lipp Tom', 
    avatar: 'https://i.pravatar.cc/150?img=7' 
  };

  const initialPosts = [
    {
      id: 1,
      author: { name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=5' },
      timestamp: '2 hours ago',
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
      caption: 'Late night coding session for our new project. The future is bright! 💡 #devlife #startup',
      likes: 128,
      comments: 12,
    },
    {
      id: 2,
      author: { name: 'Mike Chen', avatar: 'https://i.pravatar.cc/150?img=1' },
      timestamp: '5 hours ago',
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop',
      caption: 'Team brainstorming session today. So many great ideas flowing. Excited for what\'s next!',
      likes: 256,
      comments: 23,
    },
    {
      id: 3,
      author: { name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?img=2' },
      timestamp: '1 day ago',
      type: 'video',
      mediaUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      caption: 'A quick look at our new office space! Loving the vibe here. #office #startupgrind',
      likes: 312,
      comments: 41,
    },
    {
      id: 4,
      author: { name: 'Lipp Tom', avatar: 'https://i.pravatar.cc/150?img=7' },
      timestamp: '2 days ago',
      type: 'text',
      caption: 'Just launched a new project! Check it out and let me know what you think. #webdev #react',
      likes: 12,
      comments: 3,
    },
    {
      id: 5,
      author: { name: 'Jessica Lee', avatar: 'https://i.pravatar.cc/150?img=10' },
      timestamp: '3 days ago',
      type: 'text',
      caption: 'The flexibility of remote work is amazing, but it\'s so important to set clear boundaries between work and personal life. What are your best tips for staying balanced? #remotework #worklifebalance',
      likes: 89,
      comments: 17,
    },
    {
      id: 6,
      author: { name: 'Chris Green', avatar: 'https://i.pravatar.cc/150?img=11' },
      timestamp: '4 days ago',
      type: 'text',
      caption: 'Been diving deep into WebAssembly lately. The potential for near-native performance on the web is a game-changer for complex applications. #wasm #webdevelopment #performance',
      likes: 152,
      comments: 29,
    }
  ];

  const [posts, setPosts] = useState(initialPosts);

  const handleCreatePost = (postData) => {
    if (postData && (postData.file || postData.caption)) {
        const newPost = {
            id: posts.length + 1,
            author: currentUser,
            timestamp: 'Just now',
            caption: postData.caption,
            likes: 0,
            comments: 0,
            type: postData.type,
            mediaUrl: postData.file,
        };
        setPosts([newPost, ...posts]);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="w-full space-y-6">
          
            {/* Create Post Section */}
            <CreatePost currentUser={currentUser} onPost={handleCreatePost} />
            <h2 className="text-xl font-bold pt-4">Posts</h2>

            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          
        </div>
      </div>
    </div>
  );
};

export default Posts;
