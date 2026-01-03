import { useState} from "react";
import { motion } from "framer-motion";
import {
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Post Card Component
export default function PostCard({ post }) {
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
                <AvatarFallback>{post.author.name}</AvatarFallback>
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