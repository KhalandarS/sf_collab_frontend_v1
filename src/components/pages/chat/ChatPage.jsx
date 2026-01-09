

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Edit3, MessageCircle } from 'lucide-react';

// Import chat components
import Avatar from '@/components/chat/Avatar';
import TypingIndicator from '@/components/chat/TypingIndicator';
import MessageBubble from '@/components/chat/MessageBubble';
import ConversationItem from '@/components/chat/ConversationItem';
import OnlineContactsSidebar from '@/components/chat/OnlineContactsSidebar';
import NewMessageModal from '@/components/chat/NewMessageModal';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import DateSeparator, { shouldShowDateSeparator } from '@/components/chat/DateSeparator';
import { useAppSocket } from "@/context/SocketProvider";
import { useChatContacts } from "@/context/ChatContactsProvider";
import { useSearchParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { usersAPI } from '@/utils/APIs/userAPI';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
      ? {
          id: m.sender_id,
          firstName: m.sender_first_name || m.senderFirstName || m.sender_name || m.firstName || "",
          lastName: m.sender_last_name || m.senderLastName || m.lastName || "",
          first_name: m.sender_first_name || m.senderFirstName || m.sender_name || m.firstName || "",
          last_name: m.sender_last_name || m.senderLastName || m.lastName || "",
          profilePicture: m.sender_profile_picture || m.profilePicture || null,
          profile_picture: m.sender_profile_picture || m.profilePicture || null,
        }
      : null);

  return {
    ...m,
    created_at: created,
    sender,
    sender_id: m.sender_id || sender?.id,
    content: m.content ?? m.original_content ?? m.message ?? "",
  };
}


const ChatPage = () => {
  // ============================================
  // AUTH
  // ============================================
  const { user :currentUser, access_token: token } = useSelector((state) => state.auth);

  // ============================================
  // SOCKET CONNECTION
  // ============================================
  
  const { socket, isConnected, onlineUsers } = useAppSocket();
  const { friends } = useChatContacts();


  // ============================================
  // STATE
  // ============================================
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchParams] = useSearchParams();


  // ============================================
  // REFS
  // ============================================
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ============================================
  // API CALLS
  // ============================================
  
  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.data.conversations);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId) => {
    if (!token) return;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${conversationId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setMessages((data.data.messages || []).map(normalizeMessage));
        socket?.emit('mark_read', { conversation_id: conversationId });
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [token, socket]);

  // ============================================
  // FILE UPLOAD HANDLER
  // ============================================
  const handleFileUpload = useCallback(async (file) => {
    if (!token || !file) return null;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('content', file.name);
    formData.append('message_type', file.type.startsWith('image/') ? 'image' : 'file');
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${activeConversation.id}/messages`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await response.json();
      
      if (data.success && data.data.message) {
        return data.data.message.file_url;
      }
      return null;
    } catch (error) {
      console.error('File upload failed:', error);
      return null;
    }
  }, [token, activeConversation?.id]);

  // ============================================
  // EFFECTS
  // ============================================

  // Initial data load
  useEffect(() => {
    if (token) {
      fetchConversations();

 }
  }, [token, fetchConversations]);

  // Open DM if URL has ?user=<id>
  useEffect(() => {
    if (activeConversation) return;

    const userId = searchParams.get("user");
    if (!userId) return;
    if (!friends?.length) return;

    const friend = friends.find((f) => String(f.id) === String(userId));
    if (!friend) return;

    handleOpenChatWithFriend(friend);
  }, [searchParams, friends]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Join active conversation room
    if (activeConversation) {
      socket.emit("join_conversation", { conversation_id: activeConversation.id });
    }

    const onNewMessage = (data) => {
      if (String(data.conversation_id) === String(activeConversation?.id)) {
        setMessages((prev) => [...prev, normalizeMessage(data.message)]);
        socket.emit("mark_read", { conversation_id: activeConversation.id });
      }
      fetchConversations();
    };

    const onUserTyping = (data) => {
      if (String(data.conversation_id) === String(activeConversation?.id)) {
        if (data.is_typing) {
          setTypingUsers((prev) => {
            if (prev.find((u) => u.id === data.user_id)) return prev;
            const user = activeConversation.participants?.find((p) => String(p.id) === String(data.user_id));
            return user ? [...prev, user] : prev;
          });
        } else {
          setTypingUsers((prev) => prev.filter((u) => String(u.id) !== String(data.user_id)));
        }
      }
    };

    socket.on("new_message", onNewMessage);
    socket.on("user_typing", onUserTyping);

    return () => {
      if (activeConversation) {
        socket.emit("leave_conversation", { conversation_id: activeConversation.id });
      }
      socket.off("new_message", onNewMessage);
      socket.off("user_typing", onUserTyping);
    };
  }, [socket, activeConversation, fetchConversations]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ============================================
  // HANDLERS
  // ============================================

  // Select a conversation
  const handleSelectConversation = (conversation) => {
    if (activeConversation?.id !== conversation.id) {
      // Leave previous room
      if (socket && activeConversation) {
        socket.emit('leave_conversation', { conversation_id: activeConversation.id });
      }
      
      setActiveConversation(conversation);
      setMessages([]);
      setTypingUsers([]);
      fetchMessages(conversation.id);
    }
  };

  // Open chat with a friend (from sidebar)
  const handleOpenChatWithFriend = async (friend) => {
    // Check if conversation already exists
    const existing = conversations.find(c =>
      c.conversation_type === 'direct' &&
      c.participants?.some(p => String(p.id) === String(friend.id))
    );

    if (existing) {
      handleSelectConversation(existing);
    } else {
      // Create new conversation
      try {
        const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            participant_ids: [friend.id],
            conversation_type: 'direct',
          }),
        });
        const data = await response.json();
        if (data.success) {
          fetchConversations();
          handleSelectConversation(data.data.conversation);
        }
      } catch (error) {
        console.error('Failed to create conversation:', error);
      }
    }
  };

  // Create a group conversation
  const handleCreateGroup = async (userIds, name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          participant_ids: userIds,
          name,
          conversation_type: 'group',
        }),
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

  // Handle input change (with typing indicator)
  const handleInputChange = (value) => {
    setMessageInput(value);
    
    if (socket && activeConversation) {
      socket.emit('typing_start', { conversation_id: activeConversation.id });
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', { conversation_id: activeConversation.id });
      }, 2000);
    }
  };

  // Send a message
  const handleSendMessage = (content) => {
    if (!content || !activeConversation || !socket) return;

    socket.emit('typing_stop', { conversation_id: activeConversation.id });
    socket.emit('send_message', {
      conversation_id: activeConversation.id,
      content,
    });
    
    setMessageInput('');
  };

  // Helper: Should show avatar for this message?
  const shouldShowAvatar = (message, index) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    if (String(prevMessage.sender_id) !== String(message.sender_id)) return true;
    const prevTime = new Date(prevMessage.created_at);
    const currTime = new Date(message.created_at);
    return (currTime - prevTime) > 5 * 60 * 1000; // 5 minutes
  };

  // Filter conversations by search and tab
  const filteredConversations = conversations.filter(c => {
    // Filter by search
    if (searchTerm) {
      const name = c.name || c.participants?.find(p => String(p.id) !== String(currentUser?.id))?.firstName || '';
      if (!name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    }
    
    // Filter by tab
    if (activeTab === 'all') return true;
    if (activeTab === 'friends') return c.conversation_type === 'direct';
    if (activeTab === 'groups') return c.conversation_type === 'group';
    if (activeTab === 'startups') return c.conversation_type === 'team';
    if (activeTab === 'general') return c.conversation_type === 'general';
    
    return true;
  });

  // Get other participant for direct messages
  const otherParticipant = activeConversation?.participants?.find(
    p => String(p.id) !== String(currentUser?.id)
  );

  // ============================================
  // RENDER: Not logged in
  // ============================================
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

  // ============================================
  // RENDER: Main chat page
  // ============================================
  return (
    <div className="h-[calc(100vh-64px)] bg-zinc-950 flex">
      {/* ============================================ */}
      {/* LEFT SIDEBAR: Conversations List */}
      {/* ============================================ */}
      <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">Chats</h1>
            <div className="flex items-center gap-2">
              {/* Connection status */}
              <span 
                className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} 
                title={isConnected ? 'Connected' : 'Disconnected'}
              />
              {/* New message button */}
              <button
                onClick={() => setShowNewMessage(true)}
                className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                title="New message"
              >
                <Edit3 size={18} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search Messenger"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 rounded-full text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
          
          {/* Category Tabs */}
          <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'friends', label: 'Friends', type: 'direct' },
              { id: 'groups', label: 'Groups', type: 'group' },
              { id: 'startups', label: 'Startups', type: 'team' },
              { id: 'general', label: 'General', type: 'general' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-500 text-zinc-900'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
              <p>No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
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
        </div>
      </div>

      {/* ============================================ */}
      {/* CENTER: Chat Area */}
      {/* ============================================ */}
      <div className="flex-1 flex flex-col bg-zinc-950">
        {activeConversation ? (
          <>
            {/* Chat Header - No more Phone/Video/Info icons */}
            <ChatHeader
              conversation={activeConversation}
              currentUserId={currentUser.id}
              isOnline={otherParticipant && onlineUsers.includes(otherParticipant.id)}
            />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto py-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                  <Avatar
                    src={otherParticipant?.profilePicture}
                    name={`${otherParticipant?.firstName || ''}`}
                    size="xl"
                    showStatus={false}
                  />
                  <p className="mt-4 font-medium text-white">
                    {otherParticipant?.firstName} {otherParticipant?.lastName}
                  </p>
                  <p className="text-sm text-zinc-500">Start a conversation</p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const prevMessage = index > 0 ? messages[index - 1] : null;
                  // Use String() comparison to avoid type mismatch
                  const isOwn = String(message.sender_id) === String(currentUser.id);
                  
                  return (
                    <React.Fragment key={message.id || index}>
                      {/* Date separator (Today, Yesterday, etc.) */}
                      {shouldShowDateSeparator(message, prevMessage) && (
                        <DateSeparator date={message.created_at} />
                      )}
                      
                      {/* Message bubble */}
                      <MessageBubble
                        message={message}
                        isOwn={isOwn}
                        showAvatar={shouldShowAvatar(message, index)}
                        currentUserId={currentUser.id}
                      />
                    </React.Fragment>
                  );
                })
              )}
              
              {/* Typing indicator */}
              <TypingIndicator users={typingUsers} />
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input - with file upload support */}
            <ChatInput
              value={messageInput}
              onChange={handleInputChange}
              onSend={handleSendMessage}
              onFileUpload={handleFileUpload}
              socket={socket}
              conversationId={activeConversation?.id}
              disabled={!activeConversation}
            />
          </>
        ) : (
          /* No conversation selected */
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={40} className="text-indigo-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Your Messages</h2>
            <p className="text-zinc-500 text-sm mb-4">Send private messages to a friend or group</p>
            <button
              onClick={() => setShowNewMessage(true)}
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-zinc-900 font-medium rounded-full transition-colors"
            >
              Send message
            </button>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* RIGHT SIDEBAR: Online Contacts */}
      {/* ============================================ */}
      <OnlineContactsSidebar
        friends={friends}
        onlineUsers={onlineUsers}
        onOpenChat={handleOpenChatWithFriend}
        onNewMessage={() => setShowNewMessage(true)}
        className="hidden lg:flex"
      />

      {/* ============================================ */}
      {/* NEW MESSAGE MODAL */}
      {/* ============================================ */}
      <NewMessageModal
        isOpen={showNewMessage}
        onClose={() => setShowNewMessage(false)}
        friends={friends}
        onlineUsers={onlineUsers}
        onSelectUser={handleOpenChatWithFriend}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
};

export default ChatPage;