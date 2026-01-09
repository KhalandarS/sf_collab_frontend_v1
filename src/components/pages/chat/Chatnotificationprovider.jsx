<<<<<<< HEAD
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} from "react";

//import { io } from 'socket.io-client';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, MessageCircle, Users, Globe, Shield, Reply, Send, ChevronRight } from 'lucide-react';
import { useAppSocket } from "@/context/SocketProvider";

const SocketContext = createContext(null);

=======
import React, { useState, useEffect, useCallback, useRef, createContext } from 'react';
import { io } from 'socket.io-client';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, MessageCircle, Users, Globe, Shield, Reply, Send, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import NotificationAvatar from './NotificationAvatar';
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692

// ============================================
// CONFIGURATION
// ============================================
<<<<<<< HEAD
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
=======

const SOCKET_URL = import.meta.env.VITE_SOCKET_API_URL || 'http://localhost:5000'; // Please do not change this line directly, change yout .env
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
const NOTIFICATION_DURATION = 5000; // 5 seconds
const MAX_NOTIFICATIONS = 2; // Max stacked notifications
// ============================================
// CONTEXT
// ============================================
const ChatNotificationContext = createContext(null);




// ============================================
// SINGLE TOAST NOTIFICATION
// ============================================
const ChatToast = ({ 
  notification, 
  onClose, 
  onNavigate, 
  onQuickReply,
  index 
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);
  const progressRef = useRef(null);

  const { message, conversation, sender } = notification;

  // Auto-close timer
  useEffect(() => {
    if (isExpanded) return; // Don't auto-close when expanded
    
    const timer = setTimeout(() => {
      handleClose();
    }, NOTIFICATION_DURATION);

    return () => clearTimeout(timer);
  }, [isExpanded]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(notification.id), 300);
  };

  const handleNavigate = () => {
    handleClose();
    onNavigate(conversation.id);
  };

  const handleReply = async (e) => {
    e?.preventDefault();
    if (!replyText.trim() || isSending) return;

    setIsSending(true);
    await onQuickReply(conversation.id, replyText.trim());
    setReplyText('');
    setIsSending(false);
    handleClose();
  };

  const conversationType = conversation?.conversation_type || 'direct';
  const conversationName = conversation?.name || 
    `${sender?.firstName || ''} ${sender?.lastName || ''}`.trim() || 
    'Unknown';

  return (
    <div
      className={`
        relative overflow-hidden
        w-96 max-w-[calc(100vw-2rem)]
        bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800
        border border-zinc-700/50
        rounded-2xl shadow-2xl shadow-black/50
        transform transition-all duration-300 ease-out
        ${isExiting 
          ? 'translate-x-[120%] opacity-0 scale-95' 
          : 'translate-x-0 opacity-100 scale-100'
        }
        hover:border-amber-500/30 hover:shadow-amber-500/10
        group
      `}
      style={{
        animation: !isExiting ? `slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s both` : undefined
      }}
    >
      {/* Progress bar */}
      {!isExpanded && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-zinc-800 overflow-hidden">
          <div 
            ref={progressRef}
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            style={{
              animation: `shrink ${NOTIFICATION_DURATION}ms linear forwards`
            }}
          />
        </div>
      )}

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 p-1.5 rounded-xl bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all opacity-0 group-hover:opacity-100 z-10"
      >
        <X size={14} />
      </button>

      {/* Main content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <NotificationAvatar
            src={sender?.profilePicture} 
            name={conversationName}
            type={conversationType}
          />
          
          <div className="flex-1 min-w-0">
            {/* Conversation type badge */}
            <div className="flex items-center gap-2 mb-1">
              {conversationType !== 'direct' && (
                <span className={`
                  text-[10px] font-medium px-2 py-0.5 rounded-full
                  ${conversationType === 'general' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                  ${conversationType === 'team' ? 'bg-violet-500/20 text-violet-400' : ''}
                  ${conversationType === 'group' ? 'bg-blue-500/20 text-blue-400' : ''}
                `}>
                  {conversationType === 'general' ? 'Community' : 
                   conversationType === 'team' ? 'Team' : 'Group'}
                </span>
              )}
              <span className="text-[10px] text-zinc-500">just now</span>
            </div>

            {/* Sender name */}
            <h4 className="font-semibold text-white text-sm truncate">
              {sender?.firstName} {sender?.lastName}
              {conversationType !== 'direct' && (
                <span className="font-normal text-zinc-500 ml-1">
                  in {conversation?.name}
                </span>
              )}
            </h4>

            {/* Message preview */}
            <p className="text-zinc-400 text-sm mt-1 line-clamp-2 leading-relaxed">
              {message?.content || message?.original_content}
            </p>
          </div>
        </div>

        {/* Quick actions */}
        {!isExpanded ? (
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setIsExpanded(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-medium text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              <Reply size={16} />
              Quick Reply
            </button>
            <button
              onClick={handleNavigate}
              className="flex items-center justify-center gap-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm rounded-xl transition-all"
            >
              Open
              <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          /* Expanded reply input */
          <form onSubmit={handleReply} className="mt-4">
            <div className="flex items-center gap-2 p-1 bg-zinc-800 rounded-xl">
              <input
                ref={inputRef}
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type a quick reply..."
                className="flex-1 bg-transparent px-3 py-2 text-white text-sm placeholder-zinc-500 focus:outline-none"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={!replyText.trim() || isSending}
                className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 rounded-xl transition-all"
              >
                <Send size={16} className={isSending ? 'animate-pulse' : ''} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="w-full mt-2 text-xs text-zinc-500 hover:text-zinc-400"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {/* Ambient glow effect */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

// ============================================
// NOTIFICATION CONTAINER
// ============================================
const NotificationContainer = ({ notifications, onClose, onNavigate, onQuickReply }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
      {notifications.slice(0, MAX_NOTIFICATIONS).map((notification, index) => (
        <ChatToast
          key={notification.id}
          notification={notification}
          index={index}
          onClose={onClose}
          onNavigate={onNavigate}
          onQuickReply={onQuickReply}
        />
      ))}
      
      {/* Overflow indicator */}
      {notifications.length > MAX_NOTIFICATIONS && (
        <div className="text-center text-zinc-500 text-sm py-2">
          +{notifications.length - MAX_NOTIFICATIONS} more messages
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(120%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

// ============================================
// PROVIDER COMPONENT
// ============================================
<<<<<<< HEAD
export const ChatNotificationProvider = ({ children }) => {
  const { socket, isConnected } = useAppSocket(); // ✅ shared singleton socket
=======
export default function ChatNotificationProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
<<<<<<< HEAD
=======
  
  // Get auth from localStorage
  const { user, access_token: token} = useSelector((state) => state.auth);
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692

  const [currentUserId, setCurrentUserId] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null")?.id ?? null;
  } catch {
    return null;
  }
});

useEffect(() => {
  const syncUser = () => {
    try {
      setCurrentUserId(
        JSON.parse(localStorage.getItem("user") || "null")?.id ?? null
      );
    } catch {
      setCurrentUserId(null);
    }
  };

  window.addEventListener("storage", syncUser);
  syncUser();

  return () => window.removeEventListener("storage", syncUser);
}, []);



  // Track route without rebinding socket listeners
  const isOnChatPageRef = useRef(false);

useEffect(() => {
  isOnChatPageRef.current = location.pathname === "/chat";
}, [location.pathname]);

useEffect(() => {
  if (location.pathname === "/chat") setUnreadCount(0);
}, [location.pathname]);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const navigateToConversation = useCallback(
    (conversationId) => {
      navigate(`/chat?conversation=${conversationId}`);
    },
    [navigate]
  );

  const playNotificationSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch {
      // blocked / unsupported
    }
  }, []);

  // ✅ Attach socket listeners once per socket instance
  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (data) => {
      const { message, conversation_id } = data || {};
      if (!message) return;

<<<<<<< HEAD
      const isOwnMessage = message.sender_id === currentUserId;
=======
    newSocket.on('connect', () => {
      // console.log('🔔 Notification socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      // console.log('🔔 Notification socket disconnected');
      setIsConnected(false);
    });

    // Listen for new messages
    const callback = (data) => {
      const { message, conversation_id } = data;
      
      // Don't show notification if:
      // 1. Message is from current user
      // 2. User is already on chat page viewing this conversation
      const isOwnMessage = message.sender_id === user?.id;
      const isOnChatPage = location.pathname === '/chat';
      
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
      if (isOwnMessage) return;

      // Only show toast when not on chat page
      if (!isOnChatPageRef.current) {
        addNotification({
          id: `notif-${message.id}-${Date.now()}`,
          message,
          conversation: data.conversation || { id: conversation_id },
          sender: message.sender,
          timestamp: new Date(),
        });
<<<<<<< HEAD
=======
        
        // Play notification sound
        playNotificationSound();
        
        // Update unread count
        setUnreadCount(prev => prev + 1);
      }
    }
    newSocket.on('new_message', callback);
    newSocket.on('conversation_message', callback);
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692

        playNotificationSound();
        setUnreadCount((prev) => prev + 1);
      }
    };

    const onAddedToTeamChat = (data) => {
      addNotification({
        id: `team-${Date.now()}`,
        type: "system",
        title: "Added to Team",
        message: { content: `You've been added to ${data.conversation?.name}` },
        conversation: data.conversation,
        sender: { firstName: "System", lastName: "" },
        timestamp: new Date(),
      });
    };

    socket.on("new_message", onNewMessage);
    socket.on("added_to_team_chat", onAddedToTeamChat);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("added_to_team_chat", onAddedToTeamChat);
    };
<<<<<<< HEAD
  }, [socket, currentUserId, addNotification, playNotificationSound]);
=======
  }, [token, user?.id, location.pathname]);
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692

  const sendQuickReply = useCallback(
    async (conversationId, content) => {
      if (!socket || !content?.trim()) return;

      socket.emit("send_message", {
        conversation_id: conversationId,
        content: content.trim(),
      });
    },
    [socket]
  );

  const resetUnreadCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const joinConversation = useCallback(
    (conversationId) => {
      if (socket) socket.emit("join_conversation", { conversation_id: conversationId });
    },
    [socket]
  );

  const leaveConversation = useCallback(
    (conversationId) => {
      if (socket) socket.emit("leave_conversation", { conversation_id: conversationId });
    },
    [socket]
  );

  const value = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    clearNotifications,
    navigateToConversation,
    sendQuickReply,
    resetUnreadCount,
    joinConversation,
    leaveConversation,
  };

  return (
    <ChatNotificationContext.Provider value={value}>
      {children}

      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
        onNavigate={navigateToConversation}
        onQuickReply={sendQuickReply}
      />
    </ChatNotificationContext.Provider>
  );
};

<<<<<<< HEAD

export const ChatNotificationBadge = ({ className = "" }) => {
  const { unreadCount } = useChatNotifications();

  if (!unreadCount) return null;

  return (
    <span
      className={`
        absolute -top-1 -right-1
        min-w-[18px] h-[18px]
        flex items-center justify-center
        bg-gradient-to-r from-amber-500 to-orange-500
        text-zinc-900 text-[10px] font-bold
        rounded-full
        animate-pulse
        ${className}
      `}
    >
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  );
};


export default ChatNotificationProvider;
=======

>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
