import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} from "react";

import { useNavigate, useLocation } from 'react-router-dom';
import { X, MessageCircle, Users, Globe, Shield, ChevronRight } from 'lucide-react';
import { useAppSocket } from "@/context/SocketProvider";
import Avatar from "@/components/chat/Avatar";

// ============================================
// CONFIGURATION
// ============================================
const SOCKET_URL = import.meta.env.VITE_SOCKET_API_URL || 'http://localhost:5000';
const NOTIFICATION_DURATION = 5000;
const MAX_NOTIFICATIONS = 2;
const AUTO_POPUP_ENABLED = true; // Set to false to disable auto-popup

// ============================================
// CONTEXT
// ============================================
const ChatNotificationContext = createContext(null);

// ============================================
// AVATAR COMPONENT FOR NOTIFICATIONS
// ============================================
const NotificationAvatar = ({ src, name, type }) => {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  const typeStyles = {
    general: 'from-emerald-500 to-teal-600',
    team: 'from-violet-500 to-purple-600',
    group: 'from-blue-500 to-indigo-600',
    direct: 'from-amber-500 to-orange-600'
  };

  const TypeIcon = {
    general: Globe,
    team: Shield,
    group: Users,
    direct: null
  }[type];

  if (TypeIcon && (type === 'general' || type === 'team')) {
    return (
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${typeStyles[type]} flex items-center justify-center shadow-lg`}>
        <TypeIcon size={22} className="text-white" />
      </div>
    );
  }

  return src ? (
    <img 
      src={src} 
      alt={name} 
      className="w-12 h-12 rounded-2xl object-cover shadow-lg ring-2 ring-white/10" 
    />
  ) : (
    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${typeStyles[type] || typeStyles.direct} flex items-center justify-center shadow-lg font-semibold text-white`}>
      {initials}
    </div>
  );
};

// ============================================
// SINGLE TOAST NOTIFICATION
// ============================================
const ChatToast = ({ 
  notification, 
  onClose, 
  onNavigate, 
  index 
}) => {
  const [isExiting, setIsExiting] = useState(false);

  const { message, conversation, sender } = notification;

  useEffect(() => {
  const timer = setTimeout(() => {
    handleClose();
  }, NOTIFICATION_DURATION);

  return () => clearTimeout(timer);
}, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(notification.id), 300);
  };

  const handleNavigate = () => {
    handleClose();
    onNavigate(conversation.id);
  };

  

  const conversationType = conversation?.conversation_type || 'direct';
  const conversationName = conversation?.name || 
    `${sender?.firstName || ''} ${sender?.lastName || ''}`.trim() || 
    'Unknown';

  // Get sender profile picture
  const senderProfilePic = sender?.profilePicture || 
    sender?.profile_picture || 
    sender?.profile?.picture || 
    sender?.profile?.avatar || 
    null;

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
          {/* Profile picture - using actual avatar */}
          <NotificationAvatar
            src={senderProfilePic}
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

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleNavigate}
            className="w-full px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-xl text-sm"
          >
            Open
          </button>
        </div>
      </div>

      {/* Ambient glow effect */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

// ============================================
// NOTIFICATION CONTAINER
// ============================================
const NotificationContainer = ({ notifications, onClose, onNavigate }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
      {notifications.slice(0, MAX_NOTIFICATIONS).map((notification, index) => (
        <ChatToast
          key={notification.id}
          notification={notification}
          index={index}
          onClose={onClose}
          onNavigate={onNavigate}
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
        
      `}</style>
    </div>
  );
};

// ============================================
// PROVIDER COMPONENT
// ============================================
export const ChatNotificationProvider = ({ children }) => {
  const { socket, isConnected } = useAppSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

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

  // Auto-popup ChatDock when new message arrives
  const autoPopupChatDock = useCallback((data) => {
    if (!AUTO_POPUP_ENABLED) return;
    
    const { message, conversation } = data;
    const conversationId = data.conversation_id || conversation?.id;
    
    if (!conversationId) return;

    // Get conversation title
    const title = conversation?.name || 
      `${message?.sender?.firstName || ''} ${message?.sender?.lastName || ''}`.trim() ||
      'Chat';

    // Dispatch event to ChatDock to auto-popup
    window.dispatchEvent(new CustomEvent('chatDock:autoPopup', {
      detail: {
        conversationId,
        title,
        message
      }
    }));
  }, []);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (data) => {
      const { message, conversation_id } = data || {};
      if (!message) return;

      const isOwnMessage = message.sender_id === currentUserId;
      if (isOwnMessage) return;

      // Only show toast when not on chat page
      if (!isOnChatPageRef.current) {
        // Add toast notification
        addNotification({
          id: `notif-${message.id}-${Date.now()}`,
          message,
          conversation: data.conversation || { id: conversation_id },
          sender: message.sender,
          timestamp: new Date(),
        });

        playNotificationSound();
        setUnreadCount((prev) => prev + 1);

        // Auto-popup ChatDock (like Facebook Messenger)
        autoPopupChatDock(data);
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
  }, [socket, currentUserId, addNotification, playNotificationSound, autoPopupChatDock]);

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
    </ChatNotificationContext.Provider>
  );
};

// ============================================
// HOOKS
// ============================================
export const useChatNotifications = () => {
  const context = useContext(ChatNotificationContext);
  if (!context) {
    throw new Error('useChatNotifications must be used within ChatNotificationProvider');
  }
  return context;
};

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