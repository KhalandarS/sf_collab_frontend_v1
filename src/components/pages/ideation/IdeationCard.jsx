import { Link } from "react-router-dom";
import { getStageColor } from "./getStageColor";
import { Clock, Heart, MessageCircle, MessageSquare, User, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { ideaAPI } from "@/utils/APIs/ideaAPI";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "@/utils/config";

export default function IdeationCard({ content, shouldBlur }) {
  const [likes, setLikes] = useState(content.likes);
  const [liked, setLiked] = useState(false);
  const { user, access_token } = useSelector((state) => state.auth);

  const handleLike = useCallback(
    async (e) => {
      e.preventDefault();
      e?.stopPropagation();

      try {
        setLiked((prevLiked) => {
          const newLiked = !prevLiked;
          setLikes((prevLikes) => (newLiked ? prevLikes + 1 : prevLikes - 1));
          return newLiked;
        });
  
        const res = await ideaAPI.likeIdea(content.id, access_token);
        setLikes(res.data.idea.likes);
        setLiked(res.data.idea.likedBy.includes(user.id));
      } catch (err) {
        console.error("Error liking idea:", err);
      }
    },
    [content.id, access_token, user]
  );
  return <Link
    to={`/ideation-details?id=${content.id}`}
    className="block bg-[#1A1A1A] border border-white/10 rounded-xl hover:border-white/20 hover:bg-[#212121] transition-all duration-300 group-hover:scale-[1.02] h-full relative"
  >
    {shouldBlur && (
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-10 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="text-gray-400 text-sm mb-2">🔒 Private Idea</div>
          <div className="text-gray-500 text-xs">Only the creator can view this</div>
        </div>
      </div>
    )}
    <div className={`p-6 space-y-4 ${shouldBlur ? 'blur-sm pointer-events-none' : ''}`}>
      {content.imageUrl && (
        <img
          src={content.imageUrl.startsWith('http') ? content.imageUrl : `${API_BASE_URL}${content.imageUrl}`}
          alt={content.title}
          className="w-full h-40 object-cover rounded-lg border border-white/10 mb-4"
        />
      )}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={content.author.avatar.startsWith('http') ? content.author.avatar : `${API_BASE_URL}${content.author.avatar}`}
            alt={content.author.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium text-sm text-white">
              {content.author.name}
            </h3>
            <p className="text-xs text-gray-400">
              {content.author.role}
            </p>
          </div>
        </div>
        <span
          className={`${getStageColor(
            content.stage
          )} text-xs px-2 py-1 rounded-full font-medium`}
        >
          {content.stage}
        </span>
      </div>
  
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-white leading-tight line-clamp-2">
          {content.title}
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
          {content.description}
        </p>
      </div>
  
      <div className="flex flex-wrap gap-1.5">
        {Array.isArray(content.tags) &&
          content.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-white/5 text-gray-300 text-xs px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
            >
              #{tag}
            </span>
          ))}
  
        {Array.isArray(content.tags) && content.tags.length > 3 && (
          <span className="text-gray-400 text-xs px-2 py-1">
            +{content.tags.length - 3}
          </span>
        )}
      </div>
  
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-4 text-xs text-gray-400">
  
          <span className="flex items-center gap-1" onClick={handleLike}>
            <Heart  className={`h-3 w-3 ${liked ? "text-red-500" : "text-gray-400"}`}  />
            {likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {content.comments}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {content.collaborators}
          </span>
        </div>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {content.timeAgo}
        </span>
      </div>
  
      <div className="flex items-center justify-center pt-2 gap-4">
        <div className="bg-blue-500 rounded-md px-3 py-1 " >
        <span className="text-white text-sm font-medium flex items-center gap-1 transition-colors">
          <User className="h-4 w-4" />
          Follow
          </span>
          </div>
        <span className="text-blue-400 text-sm font-medium flex items-center gap-1 group-hover:text-blue-300 transition-colors">
          <MessageSquare className="h-4 w-4" />
          Join Discussion
        </span>
      </div>
    </div>
  </Link>
}