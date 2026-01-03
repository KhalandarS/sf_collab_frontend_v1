import React, { useState, useRef, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import {
  Search, Send, Users, Settings, Plus, 
  Smile, Paperclip, MoreVertical, Check,
  Circle, Image as ImageIcon, File,
  Reply, Edit3, Trash2, X, Globe, Lock,
  MessageCircle, User, ChevronDown, ChevronRight,
  Hash, Shield, Crown, UserPlus
} from 'lucide-react';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// ============================================
// CUSTOM HOOKS
// ============================================

const useSocket = (token) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      query: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('get_online_users');
    });

    newSocket.on('disconnect', () => setIsConnected(false));

    newSocket.on('online_users', (data) => setOnlineUsers(data.user_ids || []));

    newSocket.on('user_status', (data) => {
      setOnlineUsers((prev) => 
        data.status === 'online' 
          ? [...new Set([...prev, data.user_id])]
          : prev.filter((id) => id !== data.user_id)
      );
    });

    setSocket(newSocket);
    return () => newSocket.close();
  }, [token]);

  return { socket, isConnected, onlineUsers };
};

// ============================================
// COMPONENTS
// ============================================

const Avatar = ({ src, name, size = 'md', online = false, showStatus = true }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const initials = name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="relative inline-block">
      {src ? (
        <img src={src} alt={name} className={`${sizes[size]} rounded-2xl object-cover ring-2 ring-zinc-800`} />
      ) : (
        <div className={`${sizes[size]} rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-semibold text-white ring-2 ring-zinc-800`}>
          {initials}
        </div>
      )}
      {showStatus && (
        <span className={`absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full border-2 border-zinc-900 ${online ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
      )}
    </div>
  );
};

const TypingIndicator = ({ users }) => {
  if (!users?.length) return null;
  const names = users.map((u) => u.firstName).join(', ');
  return (
    <div className="flex items-center gap-3 px-4 py-2 text-zinc-500 text-sm">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>{names} {users.length === 1 ? 'is' : 'are'} typing...</span>
    </div>
  );
};

// Chat Category Section Header
const ChatSection = ({ title, icon: Icon, count, isExpanded, onToggle, children, accentColor = 'indigo' }) => {
  const colors = {
    indigo: 'text-indigo-500 bg-indigo-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10',
    violet: 'text-violet-500 bg-violet-500/10',
    blue: 'text-blue-500 bg-blue-500/10'
  };

  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${colors[accentColor]}`}>
            <Icon size={14} />
          </div>
          <span className="text-sm font-medium text-zinc-300">{title}</span>
          {count > 0 && (
            <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded-full">{count}</span>
          )}
        </div>
        {isExpanded ? <ChevronDown size={16} className="text-zinc-500" /> : <ChevronRight size={16} className="text-zinc-500" />}
      </button>
      {isExpanded && <div className="mt-1 space-y-1">{children}</div>}
    </div>
  );
};

// Conversation List Item
const ConversationItem = ({ conversation, isActive, onClick, onlineUsers, currentUserId, compact = false }) => {
  const isGroup = conversation.conversation_type === 'group';
  const isGeneral = conversation.conversation_type === 'general';
  const isTeam = conversation.conversation_type === 'team';
  
  const otherParticipant = !isGroup && !isGeneral && !isTeam
    ? conversation.participants?.find((p) => p.id !== currentUserId)
    : null;

  const isOnline = otherParticipant
    ? onlineUsers.includes(otherParticipant.id)
    : conversation.participants?.some((p) => p.id !== currentUserId && onlineUsers.includes(p.id));

  const displayName = isGroup || isGeneral || isTeam
    ? conversation.name
    : otherParticipant
    ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
    : 'Unknown';

  const avatarUrl = isGroup || isTeam
    ? conversation.avatar_url
    : otherParticipant?.profilePicture;

  // Icon based on type
  const TypeIcon = isGeneral ? Globe : isTeam ? Shield : isGroup ? Users : User;
  const iconBg = isGeneral 
    ? 'from-emerald-500 to-teal-600' 
    : isTeam 
    ? 'from-violet-500 to-purple-600'
    : 'from-indigo-500 to-blue-600';

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${
        isActive
          ? 'bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border border-indigo-500/30'
          : 'hover:bg-zinc-800/50'
      }`}
    >
      {/* Avatar/Icon */}
      <div className="relative flex-shrink-0">
        {isGeneral || isTeam ? (
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${iconBg} flex items-center justify-center ring-2 ring-zinc-800`}>
            <TypeIcon size={18} className="text-white" />
          </div>
        ) : (
          <Avatar src={avatarUrl} name={displayName} size="md" online={isOnline} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between">
          <span className={`font-medium truncate text-sm ${isActive ? 'text-indigo-400' : 'text-zinc-200'}`}>
            {displayName}
          </span>
          {conversation.last_message && (
            <span className="text-[10px] text-zinc-600">
              {conversation.last_message.display_time?.relative || ''}
            </span>
          )}
        </div>
        {!compact && (
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-xs text-zinc-500 truncate">
              {conversation.last_message?.content || (isGeneral ? 'Community chat' : isTeam ? 'Team workspace' : 'No messages')}
            </p>
            {conversation.unread_count > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-indigo-500 text-zinc-900 text-[10px] font-bold rounded-full min-w-[18px] text-center">
                {conversation.unread_count}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
};

// Message Bubble
const MessageBubble = ({ message, isOwn, showAvatar, onReply, onEdit, onDelete, currentUserId }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const isSystemMessage = message.message_type === 'system' || message.message_type === 'notif';

  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-4 py-2 bg-zinc-800/50 rounded-full text-zinc-400 text-sm">
          {message.content || message.original_content}
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex gap-3 px-4 py-1 hover:bg-zinc-800/30 transition-colors ${isOwn ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 ${showAvatar ? 'visible' : 'invisible'}`}>
        <Avatar
          src={message.sender?.profilePicture}
          name={`${message.sender?.firstName || ''} ${message.sender?.lastName || ''}`}
          size="sm"
          showStatus={false}
        />
      </div>

      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {showAvatar && (
          <div className={`flex items-center gap-2 mb-1 text-xs ${isOwn ? 'flex-row-reverse' : ''}`}>
            <span className="font-medium text-zinc-300">
              {message.sender?.firstName} {message.sender?.lastName}
            </span>
            <span className="text-zinc-600">{formatTime(message.created_at)}</span>
          </div>
        )}

        {message.reply_to && (
          <div className={`flex items-center gap-2 mb-1 px-3 py-1 bg-zinc-800/50 rounded-lg text-xs text-zinc-500 border-l-2 border-indigo-500 ${isOwn ? 'ml-auto' : ''}`}>
            <Reply size={12} />
            <span className="truncate max-w-[200px]">{message.reply_to.content}</span>
          </div>
        )}

        <div className="relative">
          <div className={`px-4 py-2.5 rounded-2xl ${
            isOwn
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-sm'
              : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
          }`}>
            {message.file_url && (
              <div className="mb-2">
                {message.is_image ? (
                  <img src={`${API_BASE_URL}${message.file_url}`} alt={message.file_name} className="max-w-full rounded-lg max-h-60 object-cover" />
                ) : (
                  <a href={`${API_BASE_URL}${message.file_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-black/20 rounded-lg hover:bg-black/30">
                    <File size={20} />
                    <span className="text-sm truncate">{message.file_name}</span>
                  </a>
                )}
              </div>
            )}
            <p className="whitespace-pre-wrap break-words">{message.content || message.original_content}</p>
            {message.is_edited && <span className="text-xs opacity-60 ml-2">(edited)</span>}
          </div>

          <div ref={menuRef} className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'} opacity-0 group-hover:opacity-100 transition-opacity`}>
            <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1 shadow-lg">
              <button onClick={() => onReply(message)} className="p-1.5 hover:bg-zinc-700 rounded-md text-zinc-400 hover:text-white transition-colors" title="Reply">
                <Reply size={14} />
              </button>
              {isOwn && (
                <>
                  <button onClick={() => onEdit(message)} className="p-1.5 hover:bg-zinc-700 rounded-md text-zinc-400 hover:text-white transition-colors" title="Edit">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => onDelete(message.id)} className="p-1.5 hover:bg-red-600/20 rounded-md text-zinc-400 hover:text-red-400 transition-colors" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {!showAvatar && (
          <span className="text-[10px] text-zinc-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTime(message.created_at)}
          </span>
        )}
      </div>
    </div>
  );
};

// New Conversation Modal
const NewConversationModal = ({ isOpen, onClose, users, onCreateDirect, onCreateGroup }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [groupName, setGroupName] = useState('');

  if (!isOpen) return null;

  const filteredUsers = users.filter(
    (u) => u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || u.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (user) => {
    if (isGroupMode) {
      setSelectedUsers((prev) => prev.find((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user]);
    } else {
      onCreateDirect(user.id);
      onClose();
    }
  };

  const handleCreateGroup = () => {
    if (selectedUsers.length > 0 && groupName.trim()) {
      onCreateGroup(selectedUsers.map((u) => u.id), groupName);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">New Conversation</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400"><X size={20} /></button>
        </div>

        <div className="flex p-2 mx-4 mt-4 bg-zinc-800 rounded-xl">
          <button onClick={() => setIsGroupMode(false)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${!isGroupMode ? 'bg-indigo-500 text-zinc-900' : 'text-zinc-400 hover:text-white'}`}>
            Direct Message
          </button>
          <button onClick={() => setIsGroupMode(true)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${isGroupMode ? 'bg-indigo-500 text-zinc-900' : 'text-zinc-400 hover:text-white'}`}>
            Create Group
          </button>
        </div>

        {isGroupMode && (
          <div className="px-4 pt-4">
            <input type="text" placeholder="Group name..." value={groupName} onChange={(e) => setGroupName(e.target.value)} className="w-full px-4 py-3 bg-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        )}

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        {isGroupMode && selectedUsers.length > 0 && (
          <div className="px-4 flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <span key={user.id} className="flex items-center gap-1 px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm">
                {user.firstName}
                <button onClick={() => handleUserClick(user)} className="hover:text-white"><X size={14} /></button>
              </span>
            ))}
          </div>
        )}

        <div className="max-h-64 overflow-y-auto p-4">
          {filteredUsers.map((user) => (
            <button key={user.id} onClick={() => handleUserClick(user)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${selectedUsers.find((u) => u.id === user.id) ? 'bg-indigo-500/20 border border-indigo-500/30' : 'hover:bg-zinc-800'}`}>
              <Avatar src={user.profilePicture} name={`${user.firstName} ${user.lastName}`} size="md" showStatus={false} />
              <span className="text-white">{user.firstName} {user.lastName}</span>
              {selectedUsers.find((u) => u.id === user.id) && <Check className="ml-auto text-indigo-500" size={18} />}
            </button>
          ))}
        </div>

        {isGroupMode && (
          <div className="p-4 border-t border-zinc-800">
            <button onClick={handleCreateGroup} disabled={selectedUsers.length === 0 || !groupName.trim()} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-zinc-900 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-400 hover:to-blue-400 transition-colors">
              Create Group ({selectedUsers.length} selected)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN CHAT PAGE
// ============================================

const ChatPage = () => {
  // Auth
  const [token] = useState(() => localStorage.getItem('access_token'));
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  // Socket
  const { socket, isConnected, onlineUsers } = useSocket(token);

  // Chat state
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Section expansion states
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    team: true,
    direct: true,
    groups: true
  });

  // Refs
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Categorize conversations
  const categorizedConversations = {
    general: conversations.filter(c => c.conversation_type === 'general'),
    team: conversations.filter(c => c.conversation_type === 'team'),
    direct: conversations.filter(c => c.conversation_type === 'direct'),
    groups: conversations.filter(c => c.conversation_type === 'group')
  };

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setConversations(data.data.conversations);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Fetch messages
  const fetchMessages = useCallback(async (conversationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}chat/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.data.messages);
        socket?.emit('mark_read', { conversation_id: conversationId });
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [token, socket]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setAllUsers(data.data.users.filter((u) => u.id !== currentUser?.id));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, [token, currentUser]);

  // Initial load
  useEffect(() => {
    if (token) {
      fetchConversations();
      fetchUsers();
    }
  }, [token, fetchConversations, fetchUsers]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    if (activeConversation) {
      socket.emit('join_conversation', { conversation_id: activeConversation.id });
    }

    socket.on('new_message', (data) => {
      if (data.conversation_id === activeConversation?.id) {
        setMessages((prev) => [...prev, data.message]);
        socket.emit('mark_read', { conversation_id: activeConversation.id });
      }
      fetchConversations();
    });

    socket.on('user_typing', (data) => {
      if (data.conversation_id === activeConversation?.id) {
        if (data.is_typing) {
          setTypingUsers((prev) => {
            if (prev.find((u) => u.id === data.user_id)) return prev;
            const user = activeConversation.participants?.find((p) => p.id === data.user_id);
            return user ? [...prev, user] : prev;
          });
        } else {
          setTypingUsers((prev) => prev.filter((u) => u.id !== data.user_id));
        }
      }
    });

    socket.on('message_edited', (data) => {
      if (data.conversation_id === activeConversation?.id) {
        setMessages((prev) => prev.map((m) => (m.id === data.message.id ? data.message : m)));
      }
    });

    socket.on('message_deleted', (data) => {
      if (data.conversation_id === activeConversation?.id) {
        setMessages((prev) => prev.filter((m) => m.id !== data.message_id));
      }
    });

    // Team chat events
    socket.on('added_to_team_chat', (data) => {
      fetchConversations();
    });

    socket.on('new_conversation', (data) => {
      fetchConversations();
    });

    return () => {
      if (activeConversation) socket.emit('leave_conversation', { conversation_id: activeConversation.id });
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('message_edited');
      socket.off('message_deleted');
      socket.off('added_to_team_chat');
      socket.off('new_conversation');
    };
  }, [socket, activeConversation, fetchConversations]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Select conversation
  const handleSelectConversation = (conversation) => {
    if (activeConversation?.id !== conversation.id) {
      if (socket && activeConversation) socket.emit('leave_conversation', { conversation_id: activeConversation.id });
      setActiveConversation(conversation);
      setMessages([]);
      setTypingUsers([]);
      setReplyingTo(null);
      setEditingMessage(null);
      fetchMessages(conversation.id);
    }
  };

  // Typing
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    if (socket && activeConversation) {
      socket.emit('typing_start', { conversation_id: activeConversation.id });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', { conversation_id: activeConversation.id });
      }, 2000);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    const content = messageInput.trim();
    setMessageInput('');
    setReplyingTo(null);

    if (socket) socket.emit('typing_stop', { conversation_id: activeConversation.id });

    if (editingMessage) {
      try {
        const response = await fetch(`${API_BASE_URL}/chat/conversations/${activeConversation.id}/messages/${editingMessage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ content }),
        });
        const data = await response.json();
        if (data.success) setMessages((prev) => prev.map((m) => (m.id === editingMessage.id ? data.data.message : m)));
      } catch (error) {
        console.error('Failed to edit:', error);
      }
      setEditingMessage(null);
    } else {
      if (socket) {
        socket.emit('send_message', {
          conversation_id: activeConversation.id,
          content,
          reply_to_id: replyingTo?.id,
        });
      }
    }
    messageInputRef.current?.focus();
  };

  // Delete
  const handleDeleteMessage = async (messageId) => {
    if (!activeConversation) return;
    try {
      await fetch(`${API_BASE_URL}/chat/conversations/${activeConversation.id}/messages/${messageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  // Create conversations
  const handleCreateDirect = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ participant_ids: [userId], conversation_type: 'direct' }),
      });
      const data = await response.json();
      if (data.success) {
        fetchConversations();
        handleSelectConversation(data.data.conversation);
      }
    } catch (error) {
      console.error('Failed to create:', error);
    }
  };

  const handleCreateGroup = async (userIds, name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ participant_ids: userIds, name, conversation_type: 'group' }),
      });
      const data = await response.json();
      if (data.success) {
        fetchConversations();
        handleSelectConversation(data.data.conversation);
      }
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const shouldShowAvatar = (message, index) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    if (prevMessage.sender_id !== message.sender_id) return true;
    const prevTime = new Date(prevMessage.created_at);
    const currTime = new Date(message.created_at);
    return (currTime - prevTime) > 5 * 60 * 1000;
  };

  // Filter by search
  const filterBySearch = (convs) => {
    if (!searchTerm) return convs;
    return convs.filter((conv) => {
      const name = conv.conversation_type === 'group' || conv.conversation_type === 'general' || conv.conversation_type === 'team'
        ? conv.name
        : conv.participants?.find((p) => p.id !== currentUser?.id)?.firstName;
      return name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  if (!token || !currentUser) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to access chat</h2>
          <a href="/login" className="text-indigo-500 hover:text-indigo-400">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] bg-zinc-950 flex overflow-hidden rounded-2xl border border-indigo-500">
      {/* Sidebar */}
      <div className="w-80 bg-zinc-900 border-r border-indigo-500 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-indigo-500">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="text-indigo-500" />
              Messages
            </h1>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} title={isConnected ? 'Connected' : 'Disconnected'} />
              <button onClick={() => setShowNewConversation(true)} className="p-2 bg-indigo-500 hover:bg-indigo-400 rounded-xl text-zinc-900 transition-colors">
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Conversation List with Categories */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* General Chat Section */}
              {categorizedConversations.general.length > 0 && (
                <ChatSection
                  title="Community"
                  icon={Globe}
                  count={categorizedConversations.general.reduce((acc, c) => acc + (c.unread_count || 0), 0)}
                  isExpanded={expandedSections.general}
                  onToggle={() => toggleSection('general')}
                  accentColor="emerald"
                >
                  {filterBySearch(categorizedConversations.general).map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={activeConversation?.id === conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      onlineUsers={onlineUsers}
                      currentUserId={currentUser.id}
                    />
                  ))}
                </ChatSection>
              )}

              {/* Team Chat Section */}
              {categorizedConversations.team.length > 0 && (
                <ChatSection
                  title="Team Workspace"
                  icon={Shield}
                  count={categorizedConversations.team.reduce((acc, c) => acc + (c.unread_count || 0), 0)}
                  isExpanded={expandedSections.team}
                  onToggle={() => toggleSection('team')}
                  accentColor="violet"
                >
                  {filterBySearch(categorizedConversations.team).map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={activeConversation?.id === conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      onlineUsers={onlineUsers}
                      currentUserId={currentUser.id}
                    />
                  ))}
                </ChatSection>
              )}

              {/* Direct Messages Section */}
              <ChatSection
                title="Direct Messages"
                icon={User}
                count={categorizedConversations.direct.reduce((acc, c) => acc + (c.unread_count || 0), 0)}
                isExpanded={expandedSections.direct}
                onToggle={() => toggleSection('direct')}
                accentColor="indigo"
              >
                {filterBySearch(categorizedConversations.direct).length === 0 ? (
                  <div className="text-center text-indigo-500 py-4 text-sm">
                    <p>No direct messages yet</p>
                  </div>
                ) : (
                  filterBySearch(categorizedConversations.direct).map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={activeConversation?.id === conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      onlineUsers={onlineUsers}
                      currentUserId={currentUser.id}
                    />
                  ))
                )}
              </ChatSection>

              {/* Group Chats Section */}
              {categorizedConversations.groups.length > 0 && (
                <ChatSection
                  title="Group Chats"
                  icon={Users}
                  count={categorizedConversations.groups.reduce((acc, c) => acc + (c.unread_count || 0), 0)}
                  isExpanded={expandedSections.groups}
                  onToggle={() => toggleSection('groups')}
                  accentColor="blue"
                >
                  {filterBySearch(categorizedConversations.groups).map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={activeConversation?.id === conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      onlineUsers={onlineUsers}
                      currentUserId={currentUser.id}
                    />
                  ))}
                </ChatSection>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-950">
        {activeConversation ? (
          <>
            {/* Header */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center gap-3">
                {activeConversation.conversation_type === 'general' ? (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Globe size={20} className="text-white" />
                  </div>
                ) : activeConversation.conversation_type === 'team' ? (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Shield size={20} className="text-white" />
                  </div>
                ) : (
                  <Avatar
                    src={activeConversation.conversation_type === 'group' ? activeConversation.avatar_url : activeConversation.participants?.find((p) => p.id !== currentUser.id)?.profilePicture}
                    name={activeConversation.conversation_type === 'group' ? activeConversation.name : `${activeConversation.participants?.find((p) => p.id !== currentUser.id)?.firstName || ''}`}
                    size="md"
                    online={activeConversation.conversation_type === 'direct' && onlineUsers.includes(activeConversation.participants?.find((p) => p.id !== currentUser.id)?.id)}
                  />
                )}
                <div>
                  <h2 className="font-semibold text-white flex items-center gap-2">
                    {activeConversation.conversation_type === 'group' || activeConversation.conversation_type === 'general' || activeConversation.conversation_type === 'team'
                      ? activeConversation.name
                      : `${activeConversation.participants?.find((p) => p.id !== currentUser.id)?.firstName || ''} ${activeConversation.participants?.find((p) => p.id !== currentUser.id)?.lastName || ''}`}
                    {activeConversation.conversation_type === 'team' && <Crown size={14} className="text-indigo-500" />}
                  </h2>
                  <p className="text-xs text-zinc-500">
                    {activeConversation.conversation_type === 'general'
                      ? `${activeConversation.participants?.length || 0} community members`
                      : activeConversation.conversation_type === 'team'
                      ? `${activeConversation.participants?.length || 0} team members`
                      : activeConversation.conversation_type === 'group'
                      ? `${activeConversation.participants?.length || 0} members`
                      : onlineUsers.includes(activeConversation.participants?.find((p) => p.id !== currentUser.id)?.id)
                      ? 'Online'
                      : 'Offline'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                  <Users size={20} />
                </button>
                <button className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                  <Settings size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                  <MessageCircle size={64} className="mb-4 opacity-30" />
                  <p className="text-lg">No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.sender_id === currentUser.id}
                    showAvatar={shouldShowAvatar(message, index)}
                    onReply={setReplyingTo}
                    onEdit={setEditingMessage}
                    onDelete={handleDeleteMessage}
                    currentUserId={currentUser.id}
                  />
                ))
              )}
              <TypingIndicator users={typingUsers} />
              <div ref={messagesEndRef} />
            </div>

            {/* Reply/Edit Bar */}
            {(replyingTo || editingMessage) && (
              <div className="px-4 py-2 bg-zinc-900 border-t border-zinc-800 flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 text-sm">
                  {replyingTo ? (
                    <>
                      <Reply size={16} className="text-indigo-500" />
                      <span className="text-zinc-400">Replying to <span className="text-white">{replyingTo.sender?.firstName}</span></span>
                      <span className="text-zinc-600 truncate max-w-[200px]">{replyingTo.content || replyingTo.original_content}</span>
                    </>
                  ) : (
                    <>
                      <Edit3 size={16} className="text-indigo-500" />
                      <span className="text-zinc-400">Editing message</span>
                    </>
                  )}
                </div>
                <button onClick={() => { setReplyingTo(null); setEditingMessage(null); }} className="p-1 hover:bg-zinc-800 rounded text-zinc-500">
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <button type="button" className="p-2.5 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                  <Paperclip size={20} />
                </button>
                <div className="flex-1 relative">
                  <input
                    ref={messageInputRef}
                    type="text"
                    value={messageInput}
                    onChange={handleInputChange}
                    placeholder={editingMessage ? 'Edit your message...' : 'Type a message...'}
                    className="w-full px-4 py-3 bg-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <button type="button" className="p-2.5 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                  <Smile size={20} />
                </button>
                <button type="submit" disabled={!messageInput.trim()} className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indio-400 hover:to-blue-400 rounded-xl text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center mb-6">
              <MessageCircle size={48} className="text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Chat</h2>
            <p className="text-zinc-500 max-w-md mb-6">
              Select a conversation to start chatting. Join the Community Lounge to meet everyone, or chat with your team in your private workspace.
            </p>
            <button onClick={() => setShowNewConversation(true)} className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 text-zinc-900 font-semibold rounded-xl transition-colors">
              Start a Conversation
            </button>
          </div>
        )}
      </div>

      <NewConversationModal
        isOpen={showNewConversation}
        onClose={() => setShowNewConversation(false)}
        users={allUsers}
        onCreateDirect={handleCreateDirect}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
};

export default ChatPage;