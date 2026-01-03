import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ShinyText from "@/components/ui/ShinyText";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence } from "framer-motion";
import { ImageIcon, Sparkles, Video, X } from "lucide-react";
import { useRef, useState } from "react";
import MultiImageGrid from "./MultiImageGrid";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Create Post Component
export default function CreatePost({ currentUser, onPost }) {
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
if (!currentUser) return null; // or skeleton

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
            <AvatarFallback>{currentUser.name}</AvatarFallback>
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