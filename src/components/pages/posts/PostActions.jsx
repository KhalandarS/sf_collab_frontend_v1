// Post Actions Component
import { motion } from "framer-motion";
import {
  Bookmark,
  Heart,

} from "lucide-react";
import { Button } from "../../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

const iconVariants = {
  idle: { scale: 1 },
  tap: { scale: 0.9 },
  hover: { scale: 1.1, rotate: [0, -10, 10, 0], transition: { duration: 0.3 } },
};
export default function PostActions({ post, liked, setLiked, bookmarked, setBookmarked }) {
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
