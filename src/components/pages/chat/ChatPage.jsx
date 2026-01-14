import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Edit3, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { user :currentUser, access_token: token } = useSelector((state) => state.auth);
  const { socket, isConnected, onlineUsers } = useAppSocket();
  const { friends } = useChatContacts();

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
  const [showChat, setShowChat] = useState(false);
  const isMobile = window.matchMedia("(max-width: 1024px)").matches;
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  useEffect(() => {
    if (!activeConversation) {
      setShowChat(false);
    }
  }, [activeConversation]);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    if (!token) return [];

    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.data.conversations);
        return data.data.conversations;
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setIsLoading(false);
    }

    return [];
  }, [token]);


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
        if (socket) {
          socket?.emit('mark_read', { conversation_id: conversationId });

        }
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [token, socket]);

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

  useEffect(() => {
    if (token) {
      fetchConversations();
    }
  }, [token, fetchConversations]);

  useEffect(() => {
    if (activeConversation) return;

    const userId = searchParams.get("user");
    if (!userId) return;
    if (!friends?.length) return;

    const friend = friends.find((f) => String(f.id) === String(userId));
    if (!friend) return;

    handleOpenChatWithFriend(friend);
  }, [searchParams, friends, activeConversation]);

  useEffect(() => {
    if (!socket) return;

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = async (conversation) => {
    if (activeConversation?.id !== conversation.id) {
      if (socket && activeConversation) {
        socket.emit('leave_conversation', { conversation_id: activeConversation.id });
      }

      setMessages([]);
      setTypingUsers([]);
      setIsMessagesLoading(true);
      
      await fetchMessages(conversation.id);
      setActiveConversation(conversation);
      setIsMessagesLoading(false);

      if (isMobile) {
        setShowChat(true);
      }
    }
  };


  const handleOpenChatWithFriend = async (friend) => {
    const existing = conversations.find(c =>
      c.conversation_type === 'direct' &&
      c.participants?.some(p => String(p.id) === String(friend.id))
    );

    if (existing) {
      handleSelectConversation(existing);
    } else {
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
          const allConversations = await fetchConversations();
          const fullConversation = allConversations.find(
            c => String(c.id) === String(data.data.conversation.id)
          );
          if (fullConversation) {
            handleSelectConversation(fullConversation);
          }

        }
      } catch (error) {
        console.error('Failed to create conversation:', error);
      }
    }
  };

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
        const newConversation = data.data.conversation;

await fetchConversations();

// Wait one tick so state updates
setTimeout(() => {
  setConversations((prev) => {
    const fullConversation = prev.find(
      (c) => String(c.id) === String(newConversation.id)
    );
    if (fullConversation) {
      handleSelectConversation(fullConversation);
    }
    return prev;
  });
}, 0);

      }
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleInputChange = (value) => {
    setMessageInput(value);
    
    if (socket && activeConversation) {
      socket.emit('typing_start', { conversation_id: activeConversation.id });
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', { conversation_id: activeConversation.id });
      }, 2000);
    }
  };

  const handleSendMessage = (content) => {
    if (!content || !activeConversation || !socket) return;

    socket.emit('typing_stop', { conversation_id: activeConversation.id });
    socket.emit('send_message', {
      conversation_id: activeConversation.id,
      content,
    });
    
    setMessageInput('');
  };

  const shouldShowAvatar = (message, index) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    if (String(prevMessage.sender_id) !== String(message.sender_id)) return true;
    const prevTime = new Date(prevMessage.created_at);
    const currTime = new Date(message.created_at);
    return (currTime - prevTime) > 5 * 60 * 1000;
  };

  const filteredConversations = conversations.filter(c => {
    if (searchTerm) {
      const name = c.name || c.participants?.find(p => String(p.id) !== String(currentUser?.id))?.firstName || '';
      if (!name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    }
    
    if (activeTab === 'all') return true;
    if (activeTab === 'friends') return c.conversation_type === 'direct';
    if (activeTab === 'groups') return c.conversation_type === 'group';
    if (activeTab === 'startups') return c.conversation_type === 'team';
    if (activeTab === 'general') return c.conversation_type === 'general';
    
    return true;
  });

  const otherParticipant = activeConversation?.participants?.find(
    p => String(p.id) !== String(currentUser?.id)
  );

  if (!token || !currentUser) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to access chat</h2>
          <a href="/login" className="text-indigo-500 hover:text-indigo-400">Go to Login</a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-950 flex overflow-hidden">
      {/* LEFT SIDEBAR */}
      <AnimatePresence mode="wait">
        {!showChat && (
          <motion.div
            key="sidebar"
            className="w-full lg:w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col"
            initial={{ x: isMobile ? -400 : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? -400 : 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Header */}
            <div className="p-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between mb-4"
              >
                <h1 className="text-xl font-bold text-white">Chats</h1>
                <div className="flex items-center gap-2">
                  <span 
                    className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} 
                    title={isConnected ? 'Connected' : 'Disconnected'}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewMessage(true)}
                    className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                    title="New message"
                  >
                    <Edit3 size={18} />
                  </motion.button>
                </div>
              </motion.div>

              {/* Search */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="text"
                  placeholder="Search Messenger"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 rounded-full text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
              </motion.div>
              
              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-1 mt-3 overflow-x-auto pb-1"
              >
                {[
                  { id: 'all', label: 'All' },
                  { id: 'friends', label: 'Friends', type: 'direct' },
                  { id: 'groups', label: 'Groups', type: 'group' },
                  { id: 'startups', label: 'Startups', type: 'team' },
                  { id: 'general', label: 'General', type: 'general' },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-500 text-zinc-900'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"
                  />
                </div>
              ) : filteredConversations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-zinc-500"
                >
                  <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No conversations yet</p>
                </motion.div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                      },
                    },
                  }}
                >
                  {filteredConversations.map((conv) => (
                    <motion.div
                      key={conv.id}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      whileHover={{ x: 4 }}
                    >
                      <ConversationItem
                        conversation={conv}
                        isActive={activeConversation?.id === conv.id}
                        onClick={() => handleSelectConversation(conv)}
                        onlineUsers={onlineUsers}
                        currentUserId={currentUser.id}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CENTER: Chat Area */}
      <AnimatePresence mode="wait">
        {((isMobile && showChat) ||  !isMobile) && (
          <motion.div
            key="chat"
            className="flex-1 flex flex-col bg-zinc-950 lg:flex"
            initial={{ x: isMobile ? 400 : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? 400 : 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {activeConversation ? (
              <>
                <ChatHeader
                  conversation={activeConversation}
                  currentUserId={currentUser.id}
                  isOnline={otherParticipant && onlineUsers.includes(otherParticipant.id)}
                  onBack={() => {
                    setShowChat(false);
                    setActiveConversation(null);
                  }}
                  showBack={isMobile}
                />

                {/* Messages Area */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 overflow-y-auto py-4"
                >
                  {console.log(messages)}
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center h-full text-zinc-500"
                    >
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
                    </motion.div>
                  ) : (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.02,
                          },
                        },
                      }}
                    >
                      {messages.map((message, index) => {
                        const prevMessage = index > 0 ? messages[index - 1] : null;
                        const isOwn = String(message.sender_id) === String(currentUser.id);
                        
                        return (
                          <motion.div
                            key={message.id || index}
                            variants={{
                              hidden: { opacity: 0, y: 10 },
                              visible: { opacity: 1, y: 0 },
                            }}
                          >
                            {shouldShowDateSeparator(message, prevMessage) && (
                              <DateSeparator date={message.created_at} />
                            )}
                            
                            <MessageBubble
                              message={message}
                              isOwn={isOwn}
                              showAvatar={shouldShowAvatar(message, index)}
                              currentUserId={currentUser.id}
                              conversationType={activeConversation?.conversation_type}
                            />
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                  
                  <TypingIndicator users={typingUsers} />
                  <div ref={messagesEndRef} />
                </motion.div>

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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4"
                >
                  <MessageCircle size={40} className="text-indigo-500" />
                </motion.div>
                <h2 className="text-xl font-semibold text-white mb-2">Your Messages</h2>
                <p className="text-zinc-500 text-sm mb-4">Send private messages to a friend or group</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewMessage(true)}
                  className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-zinc-900 font-medium rounded-full transition-colors"
                >
                  Send message
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* RIGHT SIDEBAR */}
      <OnlineContactsSidebar
        friends={friends}
        onlineUsers={onlineUsers}
        onOpenChat={handleOpenChatWithFriend}
        onNewMessage={() => setShowNewMessage(true)}
        className="hidden lg:flex"
      />

      {/* NEW MESSAGE MODAL */}
      <AnimatePresence>
        {showNewMessage && (
          <NewMessageModal
            isOpen={showNewMessage}
            onClose={() => setShowNewMessage(false)}
            friends={friends}
            onlineUsers={onlineUsers}
            onSelectUser={handleOpenChatWithFriend}
            onCreateGroup={handleCreateGroup}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPage;