import React, { useCallback, useEffect, useRef, useState } from "react";
import { X, Minus, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import { AIAPI } from "@/services/auth/AIAPI";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function normalizeMessage(m) {
  if (!m) return m;
  return {
    ...m,
    created_at: m.created_at || m.timestamp || new Date().toISOString(),
    sender: m.sender || { id: "ai", firstName: "AI Assistant" },
    sender_id: m.sender_id || "ai",
    content: m.content || m.message || "",
  };
}

export default function AIAssistant() {
  const { user: currentUser, access_token: token } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messageEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messageEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    async (content) => {
      if (!content?.trim() || !token) return;

      const userMessage = normalizeMessage({
        id: `user-${Date.now()}`,
        content: content.trim(),
        sender_id: currentUser?.id,
        sender: { id: currentUser?.id, firstName: currentUser?.firstName },
        created_at: new Date().toISOString(),
      });

      setMessages((prev) => [...prev, userMessage]);
      setDraft("");
      setIsLoading(true);

      try {
        const res = await AIAPI.queryAssistant(content.trim(), token );

        if (!res?.success) {
          throw new Error(res?.message || "AI Assistant error");
        }
          const aiMessage = normalizeMessage({
            id: `ai-${Date.now()}`,
            content: res.data?.answer || "No response",
            sender_id: "ai",
            sender: { id: "ai", firstName: "AI Assistant" },
            created_at: new Date().toISOString(),
          });
          setMessages((prev) => [...prev, aiMessage]);
        
      } catch (e) {
        console.error("AIAssistant: send message failed:", e);
        const errorMessage = normalizeMessage({
          id: `error-${Date.now()}`,
          content: "Sorry, something went wrong. Please try again.",
          sender_id: "ai",
          sender: { id: "ai", firstName: "AI Assistant" },
          created_at: new Date().toISOString(),
        });
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [token, currentUser?.id, currentUser?.firstName]
  );
  const handleAdminFileUpload = async (file) => {
    if (!token) return null;

    try {
      const res = await AIAPI.uploadDocument(file, token);
      if (res?.success && res?.data?.filename) {
        const file = res.data.filename;
        toast.success("File uploaded successfully.");
        return file;
      } else {
        throw new Error(res?.message || "File upload failed");
      }
    } catch (e) {
      console.error("AIAssistant: file upload failed:", e);
      toast.error("File upload failed. Please try again.");
      return null;
    }
  }
  if (!currentUser) return null;

  return (
    <div className="fixed bottom-20 right-4 z-100 flex flex-col items-end gap-3 pointer-events-none md:bottom-20 md:right-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 md:inset-auto md:w-80 md:bottom-20 md:right-4 md:rounded-2xl bg-zinc-900 border border-zinc-800 md:border rounded-none md:rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
          >
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-950 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-400" />
                <div className="text-sm font-semibold text-white">AI Assistant</div>
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ backgroundColor: "rgba(39, 39, 42, 0.8)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 rounded-xl text-zinc-400 hidden md:block"
                >
                  <Minus size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ backgroundColor: "rgba(39, 39, 42, 0.8)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-zinc-400"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="h-[calc(100vh-140px)] md:h-[60vh] overflow-y-auto p-3 bg-zinc-950 space-y-2">
                    {messages.length === 0 ? (
                      <div className="text-sm text-zinc-500 text-center py-8">
                        Ask me anything...
                      </div>
                    ) : (
                      <motion.div layout>
                        {messages.map((m, i) => (
                          <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.02 }}
                          >
                            <MessageBubble
                              message={m}
                              isOwn={String(m.sender_id) === String(currentUser?.id)}
                              currentUserId={currentUser?.id}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-zinc-500 px-1 italic"
                      >
                        AI is thinking…
                      </motion.div>
                    )}
                    <div ref={messageEndRef} />
                  </div>

                  <div className="bg-zinc-900">
                    {currentUser?.role === 'admin' ? (
                      <div className="text-xs text-zinc-500 px-3 pt-1 italic">
                        As an admin, you can upload documents to provide context for the AI Assistant.
                      </div>
                    ) : null  
                    }
                    <ChatInput
                      value={draft}
                      onChange={setDraft}
                      onSend={sendMessage}
                      onFileUpload={handleAdminFileUpload}
                      disabled={isLoading}
                      allowEmojis={false}
                      allowFiles={currentUser?.role === 'admin'}
                      acceptMultipleFiles={currentUser?.role === 'admin'}
                      allowImages={false}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ display: isOpen ? 'none' : 'flex' }}
        className="relative w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg flex items-center justify-center pointer-events-auto"
      >
        <Sparkles size={20} />
      </motion.button>
    </div>
  );
}