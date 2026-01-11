import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, Minus, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import { useAppSocket } from "@/context/SocketProvider";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const LS_WINDOWS_KEY = "chatDock:windows";
const LS_UNREAD_KEY = "chatDock:unread";

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value ?? "");
  } catch {
    return fallback;
  }
}

function normalizeMessage(m) {
  if (!m) return m;

  const created =
    m.created_at ||
    m.createdAt ||
    m.timestamp ||
    m.sent_at ||
    m.sentAt ||
    m.time ||
    null;

  const sender =
    m.sender ||
    m.user ||
    m.from ||
    (m.sender_id
      ? { id: m.sender_id, firstName: m.sender_name || m.firstName || m.senderFirstName || "" }
      : null);

  return {
    ...m,
    created_at: created,
    sender,
    sender_id: m.sender_id || sender?.id,
    content: m.content ?? m.original_content ?? m.message ?? "",
  };
}

export default function ChatDock({ maxWindows = 2 }) {
  const { socket, isConnected, onlineUsers } = useAppSocket();

  const token = useMemo(() => localStorage.getItem("access_token"), []);
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [consideredActive, setConsideredActive] = useState(true);

  const [conversations, setConversations] = useState([]);
  const [isLoadingConvos, setIsLoadingConvos] = useState(false);

  const [windows, setWindows] = useState(() => {
    const saved = safeJsonParse(localStorage.getItem(LS_WINDOWS_KEY), []);
    return Array.isArray(saved)
      ? saved.map((w) => ({
          conversationId: w.conversationId,
          title: w.title || "Chat",
          minimized: !!w.minimized,
          messages: [],
          loading: false,
          draft: "",
        }))
      : [];
  });

  const [unread, setUnread] = useState(() => {
    const saved = safeJsonParse(localStorage.getItem(LS_UNREAD_KEY), {});
    return saved && typeof saved === "object" ? saved : {};
  });

  const [typingByConversation, setTypingByConversation] = useState({});
  const typingTimeoutsRef = useRef({});
  const messageEndRefs = useRef({});

  const persistWindows = useCallback((nextWindows) => {
    const minimal = nextWindows.map((w) => ({
      conversationId: w.conversationId,
      title: w.title,
      minimized: !!w.minimized,
    }));
    localStorage.setItem(LS_WINDOWS_KEY, JSON.stringify(minimal));
  }, []);

  const scrollToBottom = useCallback((conversationId) => {
    const el = messageEndRefs.current[conversationId];
    el?.scrollIntoView?.({ behavior: "smooth" });
  }, []);

  const isConvOpen = useCallback(
    (conversationId) => windows.some((w) => String(w.conversationId) === String(conversationId)),
    [windows]
  );

  const isConvMinimized = useCallback(
    (conversationId) =>
      windows.some(
        (w) => String(w.conversationId) === String(conversationId) && w.minimized
      ),
    [windows]
  );

  const bumpUnread = useCallback((conversationId) => {
    const key = String(conversationId);
    setUnread((prev) => {
      const next = { ...prev, [key]: (prev[key] || 0) + 1 };
      localStorage.setItem(LS_UNREAD_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("chat:unread", { detail: { conversationId: key, unread: next } }));
      return next;
    });
  }, []);

  const clearUnread = useCallback((conversationId) => {
    const key = String(conversationId);
    setUnread((prev) => {
      const next = { ...prev, [key]: 0 };
      localStorage.setItem(LS_UNREAD_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("chat:unread", { detail: { conversationId: key, unread: next } }));
      return next;
    });
  }, []);

  useEffect(() => {
    const onFocus = () => setConsideredActive(true);
    const onBlur = () => setConsideredActive(false);
    const onVis = () => setConsideredActive(!document.hidden);

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const fetchConversations = useCallback(async () => {
    if (!token) return;
    setIsLoadingConvos(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data?.success) setConversations(data.data.conversations || []);
    } catch (e) {
      console.error("ChatDock: fetch conversations failed:", e);
    } finally {
      setIsLoadingConvos(false);
    }
  }, [token]);

  const fetchMessages = useCallback(
    async (conversationId) => {
      if (!token || !conversationId) return;
      const cid = String(conversationId);

      setWindows((prev) =>
        prev.map((w) => (String(w.conversationId) === cid ? { ...w, loading: true } : w))
      );

      try {
        const res = await fetch(`${API_BASE_URL}/chat/conversations/${cid}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data?.success) {
          const msgs = (data.data.messages || []).map(normalizeMessage);

          setWindows((prev) =>
            prev.map((w) =>
              String(w.conversationId) === cid
                ? { ...w, messages: msgs, loading: false }
                : w
            )
          );

          setTimeout(() => scrollToBottom(cid), 30);

          if (consideredActive && !isConvMinimized(cid)) {
            clearUnread(cid);
            socket?.emit?.("mark_read", { conversation_id: cid });
          }
        } else {
          setWindows((prev) =>
            prev.map((w) => (String(w.conversationId) === cid ? { ...w, loading: false } : w))
          );
        }
      } catch (e) {
        console.error("ChatDock: fetch messages failed:", e);
        setWindows((prev) =>
          prev.map((w) => (String(w.conversationId) === cid ? { ...w, loading: false } : w))
        );
      }
    },
    [token, scrollToBottom, socket, consideredActive, isConvMinimized, clearUnread]
  );

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const joinedRef = useRef(new Set());

  useEffect(() => {
    if (!socket) return;

    const currentIds = new Set(windows.map((w) => String(w.conversationId)));

    for (const id of currentIds) {
      if (!joinedRef.current.has(id)) {
        socket.emit("join_conversation", { conversation_id: id });
        joinedRef.current.add(id);
      }
    }

    for (const id of Array.from(joinedRef.current)) {
      if (!currentIds.has(id)) {
        socket.emit("leave_conversation", { conversation_id: id });
        joinedRef.current.delete(id);
      }
    }
  }, [socket, windows]);

  const openWindow = useCallback(
    async ({ conversationId, title }) => {
      if (!conversationId) return;
      const cid = String(conversationId);

      setWindows((prev) => {
        const exists = prev.find((w) => String(w.conversationId) === cid);
        if (exists) {
          const without = prev.filter((w) => String(w.conversationId) !== cid);
          const next = [...without, { ...exists, minimized: false }];
          persistWindows(next);
          return next;
        }

        const next = [
          ...prev,
          { conversationId: cid, title: title || "Chat", minimized: false, messages: [], loading: false, draft: "" },
        ];
        if (next.length > maxWindows) next.shift();

        persistWindows(next);
        return next;
      });

      clearUnread(cid);
      socket?.emit?.("join_conversation", { conversation_id: cid });
      await fetchMessages(cid);
    },
    [fetchMessages, maxWindows, persistWindows, clearUnread, socket]
  );

  const closeWindow = useCallback(
    (conversationId) => {
      const cid = String(conversationId);
      socket?.emit?.("leave_conversation", { conversation_id: cid });

      setWindows((prev) => {
        const next = prev.filter((w) => String(w.conversationId) !== cid);
        persistWindows(next);
        return next;
      });

      setTypingByConversation((prev) => {
        const next = { ...prev };
        delete next[cid];
        return next;
      });
    },
    [persistWindows, socket]
  );

  const toggleMinimize = useCallback(
    (conversationId) => {
      const cid = String(conversationId);
      setWindows((prev) => {
        const next = prev.map((w) =>
          String(w.conversationId) === cid ? { ...w, minimized: !w.minimized } : w
        );
        persistWindows(next);
        return next;
      });
    },
    [persistWindows]
  );

  useEffect(() => {
    if (!consideredActive) return;
    windows.forEach((w) => {
      if (!w.minimized) {
        clearUnread(w.conversationId);
        socket?.emit?.("mark_read", { conversation_id: String(w.conversationId) });
      }
    });
  }, [consideredActive, windows, clearUnread, socket]);

  useEffect(() => {
    if (!socket) return;

    const onUserTyping = (data) => {
      const conversationId = data?.conversation_id;
      const userId = data?.user_id;
      const isTyping = !!data?.is_typing;

      if (!conversationId || !userId) return;

      const cid = String(conversationId);
      const uid = String(userId);

      if (currentUser?.id && String(currentUser.id) === uid) return;

      setTypingByConversation((prev) => {
        const current = prev[cid] || {};
        const next = { ...prev };

        if (isTyping) {
          next[cid] = { ...current, [uid]: true };
        } else {
          const copy = { ...current };
          delete copy[uid];
          next[cid] = copy;
        }
        return next;
      });
    };

    socket.on("user_typing", onUserTyping);
    return () => socket.off("user_typing", onUserTyping);
  }, [socket, currentUser?.id]);

  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (payload) => {
      const messageData = payload?.message || payload;
      const cid = String(payload?.conversation_id || messageData?.conversation_id);

      const messageNorm = normalizeMessage(messageData);

      if (!cid || !messageNorm) return;

      setWindows((prev) => {
        return prev.map((w) => {
          if (String(w.conversationId) === cid) {
            const exists = w.messages.some(m => String(m.id) === String(messageNorm.id));
            if (exists) return w;
            return { ...w, messages: [...(w.messages || []), messageNorm] };
          }
          return w;
        });
      });

      if (!isConvOpen(cid) || isConvMinimized(cid) || !consideredActive) {
        bumpUnread(cid);
      } else {
        clearUnread(cid);
        socket.emit("mark_read", { conversation_id: cid });
      }
      setTimeout(() => scrollToBottom(cid), 50);
    };

    socket.on("new_message", onNewMessage);
    return () => socket.off("new_message", onNewMessage);
  }, [socket, currentUser?.id, isConvOpen, isConvMinimized, consideredActive]);

  const sendMessage = useCallback(
    (conversationId, content) => {
      if (!socket) return;
      const cid = String(conversationId);
      const text = content?.trim();
      if (!cid || !text) return;

      socket.emit("send_message", { conversation_id: cid, content: text });

      setWindows((prev) =>
        prev.map((w) => (String(w.conversationId) === cid ? { ...w, draft: "" } : w))
      );

      if (consideredActive && !isConvMinimized(cid)) {
        clearUnread(cid);
        socket.emit("mark_read", { conversation_id: cid });
      }
    },
    [socket, consideredActive, isConvMinimized, clearUnread]
  );

  const filteredConversations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const isDirectOnline = (conv) => {
      if (conv.conversation_type !== "direct") return false;
      const other = conv.participants?.find((p) => String(p.id) !== String(currentUser?.id));
      if (!other?.id) return false;
      return (onlineUsers || []).some((id) => String(id) === String(other.id));
    };

    return (conversations || []).filter((c) => {
      if (term) {
        const display =
          c.name ||
          c.participants?.find((p) => String(p.id) !== String(currentUser?.id))?.firstName ||
          "";
        if (!String(display).toLowerCase().includes(term)) return false;
      }

      if (activeTab === "online") {
        return isDirectOnline(c);
      }
      return true;
    });
  }, [conversations, searchTerm, activeTab, onlineUsers, currentUser?.id]);

  const totalUnread = useMemo(() => {
    return Object.values(unread || {}).reduce((sum, v) => sum + (Number(v) || 0), 0);
  }, [unread]);

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-row-reverse items-end gap-3 pointer-events-none">
      <div className="flex flex-col items-end gap-3 pointer-events-auto">
        <AnimatePresence>
          {isPanelOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-3 py-2 bg-zinc-950 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-white">Chats</div>
                  <motion.span
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-500"}`}
                  />
                </div>
                <button onClick={() => setIsPanelOpen(false)} className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400"><X size={16} /></button>
              </div>

              <div className="p-3 border-b border-zinc-800">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full px-3 py-2 bg-zinc-800 rounded-xl text-sm text-white focus:outline-none"
                />
                <div className="flex gap-2 mt-2">
                  {["all", "online"].map((id) => (
                    <motion.button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeTab === id ? "bg-indigo-500 text-zinc-900" : "bg-zinc-800 text-zinc-400"}`}
                    >
                      {id.charAt(0).toUpperCase() + id.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="max-h-[420px] overflow-y-auto p-2">
                {isLoadingConvos ? (
                  <div className="p-4 text-zinc-500 text-sm">Loading…</div>
                ) : (
                  <motion.div layout>
                    {filteredConversations.map((conv) => {
                      const title = conv.name || conv.participants?.find((p) => String(p.id) !== String(currentUser?.id))?.firstName || "Chat";
                      const unreadCount = unread?.[String(conv.id)] || 0;
                      return (
                        <motion.button
                          key={conv.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          whileHover={{ backgroundColor: "rgba(39, 39, 42, 0.6)" }}
                          onClick={() => openWindow({ conversationId: conv.id, title })}
                          className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="text-white text-sm font-medium truncate">{title}</div>
                            <div className="text-zinc-500 text-xs truncate">{conv.conversation_type}</div>
                          </div>
                          <AnimatePresence>
                            {unreadCount > 0 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="min-w-[18px] h-[18px] rounded-full bg-amber-500 text-zinc-900 text-[10px] font-bold flex items-center justify-center"
                              >
                                {unreadCount}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsPanelOpen((v) => !v)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-900 shadow-lg flex items-center justify-center pointer-events-auto"
        >
          <MessageCircle size={20} />
          <AnimatePresence>
            {totalUnread > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-zinc-900 text-amber-400 text-[10px] font-bold flex items-center justify-center border border-amber-500/40"
              >
                {totalUnread > 99 ? "99+" : totalUnread}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="flex flex-row-reverse items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {windows.map((w) => {
            const cid = String(w.conversationId);
            const unreadCount = unread?.[cid] || 0;
            const typingCount = Object.keys(typingByConversation?.[cid] || {}).length;

            return (
              <motion.div
                key={cid}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              >
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-950 border-b border-zinc-800">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{w.title}</div>
                    <AnimatePresence>
                      {w.minimized && unreadCount > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-[11px] text-amber-400"
                        >
                          {unreadCount} new
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(39, 39, 42, 0.8)" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleMinimize(cid)}
                      className="p-2 rounded-xl text-zinc-400"
                    >
                      <Minus size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(39, 39, 42, 0.8)" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => closeWindow(cid)}
                      className="p-2 rounded-xl text-zinc-400"
                    >
                      <X size={16} />
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence>
                  {!w.minimized && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="h-80 overflow-y-auto p-3 bg-zinc-950 space-y-2">
                        {w.loading ? (
                          <div className="text-sm text-zinc-500">Loading…</div>
                        ) : (
                          <motion.div layout>
                            {(w.messages || []).map((m, i) => (
                              <motion.div
                                key={m.id || `${cid}-${i}`}
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
                        <AnimatePresence>
                          {typingCount > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-xs text-zinc-500 px-1 italic"
                            >
                              Typing…
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div ref={(el) => (messageEndRefs.current[cid] = el)} />
                      </div>

                      <div className="bg-zinc-900">
                        <ChatInput
                          value={w.draft || ""}
                          onChange={(val) => {
                            setWindows(prev => prev.map(x => String(x.conversationId) === cid ? { ...x, draft: val } : x));
                            if (socket) {
                              socket.emit("typing_start", { conversation_id: cid });
                              if (typingTimeoutsRef.current[cid]) clearTimeout(typingTimeoutsRef.current[cid]);
                              typingTimeoutsRef.current[cid] = setTimeout(() => socket.emit("typing_stop", { conversation_id: cid }), 1200);
                            }
                          }}
                          onSend={(content) => {
                            if (socket) socket.emit("typing_stop", { conversation_id: cid });
                            sendMessage(cid, content);
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}