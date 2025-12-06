import React, { useState, useEffect, useRef } from 'react';
import ChatWebSocketClient from '../services/websocket/ChatWebSocketClient';
import TimeAwareMessageInput from './TimeAwareMessageInput';
// import Alert from './sections/Alert';
import ScrollToTop from './sections/ScrollToTop';
import { RiDeleteBin6Line } from "react-icons/ri";
import '../components/style/ChatComponent.css';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ShineButton } from './lightswind/shine-button'

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../components/ui/avatar";
import {Badge} from "../components/ui/badge";
import { Action, Actions } from '../components/ui/shadcn-io/ai/actions';
import {
    CopyIcon,
    RefreshCcwIcon,
    ChevronLeft, ChevronRight,
    ShareIcon,
    ThumbsDownIcon,
    ThumbsUpIcon,
    Eye
  } from 'lucide-react';
import { MessageCircle, Plus, Send, Edit2, Check, X, Users, Circle, Phone, Video, Star, Search, Settings, Bell, Image, FileText, File, Download, ChevronDown, ChevronUp } from 'lucide-react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Core CSS
import 'tippy.js/animations/scale.css'; // Animation CSS
import 'tippy.js/themes/light.css'; // Theme CSS

import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert'
import AnimatedNotification  from '../components/lightswind/animated-notification'
// Mock users data
// const MOCK_USERS = [
//   { id: 11, firstName: 'John', lastName: 'Doe', email: 'john@example.com', profilePicture: null, timezone: 'America/New_York' },
//   { id: 12, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', profilePicture: null, timezone: 'Europe/London' },
//   { id: 13, firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', profilePicture: null, timezone: 'Asia/Tokyo' },
//   { id: 14, firstName: 'Sarah', lastName: 'Wilson', email: 'sarah@example.com', profilePicture: null, timezone: 'Australia/Sydney' },
//   { id: 15, firstName: 'David', lastName: 'Brown', email: 'david@example.com', profilePicture: null, timezone: 'Europe/Paris' },
// ];

const actions = [
    {
      icon: ThumbsUpIcon,
      label: 'Like',
      onClick: () => setLiked(!liked),
    },
    {
      icon: ThumbsDownIcon,
      label: 'Dislike',
      onClick: () => setDisliked(!disliked),
    },
    {
      icon: CopyIcon,
      label: 'Copy',
      onClick: () => handleCopy(),
    },
    {
      icon: ShareIcon,
      label: 'Share',
      onClick: () => handleShare(),
    },
    {
        icon: Edit2,
        label: 'Update',
        onClick: () => handleShare(),
    },
    {
        icon: RiDeleteBin6Line,
        label: 'Delete',
        onClick: () => handleShare(),
    },
  ];

  const ConversationsCardSkeleton = () => (
    <div className="animate-pulse  w-full">
        <div className="bg-gray-500/5 flex items-center flex-col gap-4 p-4">
            <div className='flex items-center justify-between gap-4 w-full'>
                <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                <div className="h-3 w-16 rounded bg-gray-700"></div>
            </div>
            
            <div className="flex-1  w-full space-y-2">
                <div className="h-4 w-40 rounded bg-gray-700"></div>
                <div className="h-3 w-32 rounded bg-gray-700"></div>
            </div>
        </div>
    </div>
);

const MessagesSkeleton = () => {
    return (
      <div className="space-y-6 p-4">
        {/* Incoming message skeleton */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
          
          <div className="flex-1">
            {/* Sender name */}
            <div className="h-3 w-24 rounded-full bg-gray-700 animate-pulse mb-2"></div>
            
            {/* Message bubble */}
            <div className="bg-gray-800 rounded-2xl p-4 max-w-[70%]">
              <div className="space-y-2">
                <div className="h-3 w-full rounded-full bg-gray-700 animate-pulse"></div>
                <div className="h-3 w-3/4 rounded-full bg-gray-700 animate-pulse"></div>
                <div className="h-3 w-1/2 rounded-full bg-gray-700 animate-pulse"></div>
              </div>
            </div>
            
            {/* Timestamp */}
            <div className="h-2 w-16 rounded-full bg-gray-700 animate-pulse mt-2 ml-2"></div>
          </div>
        </div>
  
        {/* Outgoing message skeleton */}
        <div className="flex items-start gap-3 justify-end">
          <div className="flex-1 flex flex-col items-end">
            {/* Sender name */}
            <div className="h-3 w-24 rounded-full bg-gray-700 animate-pulse mb-2"></div>
            
            {/* Message bubble */}
            <div className="bg-gray-800 rounded-2xl p-4 max-w-[70%]">
              <div className="space-y-2">
                <div className="h-3 w-full rounded-full bg-gray-700 animate-pulse"></div>
                <div className="h-3 w-4/5 rounded-full bg-gray-700 animate-pulse"></div>
              </div>
            </div>
            
            {/* Timestamp */}
            <div className="h-2 w-16 rounded-full bg-gray-700 animate-pulse mt-2 mr-2"></div>
          </div>
          
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
        </div>
  
        {/* Image message skeleton */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
          
          <div className="flex-1">
            <div className="h-3 w-24 rounded-full bg-gray-700 animate-pulse mb-2"></div>
            
            <div className="bg-gray-800 rounded-2xl p-4 max-w-[70%]">
              {/* Image placeholder */}
              <div className="w-48 h-32 rounded-lg bg-gray-700 animate-pulse mb-3"></div>
              
              <div className="space-y-2">
                <div className="h-3 w-32 rounded-full bg-gray-700 animate-pulse"></div>
              </div>
            </div>
            
            <div className="h-2 w-16 rounded-full bg-gray-700 animate-pulse mt-2 ml-2"></div>
          </div>
        </div>
  
        {/* Short message skeleton */}
        <div className="flex items-start gap-3 justify-end">
          <div className="flex-1 flex flex-col items-end">
            <div className="h-3 w-24 rounded-full bg-gray-700 animate-pulse mb-2"></div>
            
            <div className="bg-gray-800 rounded-2xl p-4 max-w-[50%]">
              <div className="h-3 w-32 rounded-full bg-gray-700 animate-pulse"></div>
            </div>
            
            <div className="h-2 w-16 rounded-full bg-gray-700 animate-pulse mt-2 mr-2"></div>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
        </div>
      </div>
    );
  };


  
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
//   const SOCKET_API_URL = 'http://localhost:5000';
  const SOCKET_API_URL = import.meta.env.VITE_SOCKET_API_URL || 'http://localhost:5000';
  
const ChatComponent = () => {

    const [userId, setUserId] = useState(null);
    const [users, setUsers] = useState([]);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' })

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState({});
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [isConnected, setIsConnected] = useState(false);
    
    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletedMessage, setDeletedMessage] = useState(null);
    const [newConversationName, setNewConversationName] = useState('');
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [conversationType, setConversationType] = useState('direct');
    
    // Alert states
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState(null);
    const [alertTitle, setAlertTitle] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertShowIcon, setAlertShowIcon] = useState(null);
    const [alertDismissible, setAlertDismissible] = useState(null);
    const [alertActions, setAlertActions] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 30;
    
    // Edit message states
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    
    // File states
    const [conversationFiles, setConversationFiles] = useState([]);
    const [showFilesExpanded, setShowFilesExpanded] = useState(false);
    const [showLinksExpanded, setShowLinksExpanded] = useState(false);
    
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    
    const [readConversations, setReadConversations] = useState(new Set());
    
    const wsClient = useRef(null);
    const messagesEndRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(true);


    const { user, access_token } = useSelector((state) => state.auth);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
  
  

    //! API Helper with proper headers
    // const apiRequest = async (url, options = {}) => {
        
    //     const defaultHeaders = {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json',
    //     };
    
    //     const config = {
    //         ...options,
    //         headers: {
    //         ...defaultHeaders,
    //         ...options.headers,
    //         },
    //         credentials: 'include',
    //     };
    
    //     try {
    //         const token = access_token; 
    //         if (!token) {
    //             console.error('No access token found');
    //             return;
    //         }
    //         const response = await fetch(url, config);
            
    //         if (!response.ok) {
    //         const errorData = await response.json().catch(() => ({}));
    //         throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    //         }
            
    //         return await response.json();
    //     } catch (error) {
    //         console.error('API Request failed:', error);
    //         throw error;
    //     }
    // };
    
    //! Retry connection:
    const retryConnection = () => {
        wsClient.current.connect();
        setAlertActions(null);
    };
    
    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            const token = access_token; 
            
            if (!token) {
                console.error('No access token found');
            return;
            }
        
            
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: itemsPerPage.toString()
            });
        
            if (searchQuery) params.append('search', searchQuery);
            if (selectedRole !== '') params.append('role', selectedRole);
            if (selectedStatus !== '') params.append('status', selectedStatus);

        
            const response = await fetch(`${API_BASE_URL}/users?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
        
            if (data.success) {
                
                console.log(data.data.users);
                
                setUsers(data.data.users.map((u)=>({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, profilePicture: u.profile.picture, timezone: u.profile.timezone,role:u.role})));
                setTotalPages(data.data.pagination.total);
                setCurrentPage(data.data.pagination.page);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };
    
    
    const clearFilters = () => {
        setSearchQuery("");
        setSelectedRole("");
        setSelectedStatus("");
    };
    
    //! Set userId when user changes
    useEffect(()=>{
        if(user){
            fetchUsers();
            setUserId(user.id);
        }
        loadConversations();
        
    },[]);
    
    //! Initialize WebSocket connection
    useEffect(() => {
        if (!userId) return;
    
        wsClient.current = new ChatWebSocketClient(SOCKET_API_URL, userId);
        
        wsClient.current.on('connected', () => {
            console.log('WebSocket connected');
            setIsConnected(true);
            loadConversations();
            
            setShowAlert(true)
            setAlertVariant("success")
            // setAlertTitle("Connected")
            setAlertMessage("You are now connected to the chat server.")
            setAlertShowIcon(true)
            setAlertDismissible(true)
        });
    
        wsClient.current.on('disconnected', () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            
            setShowAlert(true)
            setAlertVariant("error")
            // setAlertTitle("Disconnected")
            setAlertMessage("You have been disconnected from the chat server.")
            setAlertShowIcon(true)
            setAlertDismissible(true)
            setAlertActions(
                <button
                    onClick={retryConnection}
                    className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 
                                text-red-300 text-sm font-medium transition-all duration-200 
                                border border-red-500/30"
                >
                    Retry
                </button>
            )
        });
        
        wsClient.current.on('mark_message_read', (data) => {
            // If someone else read messages in a conversation, update counts
            if (data.conversation_id && data.user_id !== userId) {
                loadConversations();
            }
        });
    
        wsClient.current.on('new_message', handleNewMessage);
        wsClient.current.on('message_edited', handleMessageEdited);
        wsClient.current.on('user_typing', handleUserTyping);
        wsClient.current.on('user_online', handleUserOnline);
        wsClient.current.on('user_offline', handleUserOffline);
    
        wsClient.current.connect();
    
        return () => {
            if (wsClient.current) {
            wsClient.current.disconnect();
            }
        };
    }, [user]);

    //! LOAD USER CONVERSATIONS:
    const loadConversations = async () => {
        setLoading(true);
        
        const token = access_token; 
        
        if (!token) {
            console.error('No access token found');
            return;
        }
        try {
            const response = await fetch(
                `${API_BASE_URL}/chat/conversations?user_id=${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            console.log('Conversations response:', data);
            
            if (data.success && data.data?.conversations) {
                setConversations(data.data.conversations);
                setLoading(false);

            } else {
                console.error('No conversations found or invalid response:', data);
                setConversations([]);
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
            setConversations([]);
        }
    };


    //! LOAD USER MESSAGES FOR CHOSEN CONVERSATION:
    const loadMessages = async (conversationId) => {
        setLoadingMessages(true);
        const token = access_token; 
        
        if (!token) {
            console.error('No access token found');
            return;
        }
        try {
            const response = await fetch(
                `${API_BASE_URL}/chat/conversations/${conversationId}/messages?user_id=${userId}&limit=50`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.data?.messages) {
                setMessages(data.data.messages);
                console.log('Loaded Messages:', data.data.messages);
                setLoadingMessages(false);
                loadConversationFiles(conversationId);
            } else {
                setMessages([]);
                setLoadingMessages(false);
                
            }
        } catch (error) {
            console.error('Error loading messages:', error);
            setMessages([]);
        }
    };

    
    //! LOAD FILES FOR CHOSEN CONVERSATION:
    const loadConversationFiles = async (conversationId) => {
        const token = access_token; 
        
        if (!token) {
            console.error('No access token found');
            return;
        }
        try {
            const response = await fetch(
                `${API_BASE_URL}/chat/conversations/${conversationId}/files`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.data?.files) {
                setConversationFiles(data.data.files);
            } else {
                setConversationFiles([]);
            }
        } catch (error) {
            console.error('Error loading files:', error);
            setConversationFiles([]);
        }
    };

    
    //! load messages and files when selected conversation changes:
    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.id);
            loadConversationFiles(selectedConversation.id);
            if (wsClient.current) {
                wsClient.current.joinConversation(selectedConversation.id);
            }
        }
    }, [selectedConversation]);
    
    //! scroll to bottom on new message:
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    //! HANDLE NEW MESSAGE:
    const handleNewMessage = (data) => {
        if (data.message && selectedConversation && data.conversation_id === selectedConversation.id) {
            setMessages(prev => {
                if (prev.some(msg => msg.id === data.message.id)) {
                    return prev;
                }
                return [...prev, data.message];
            });
            
            // If this message is from another user and we're not currently viewing this conversation,
            // increment the unread count locally and reload conversations
            if (data.message.sender_id !== userId) {
                loadConversations(); // This will refresh the unread counts
            }
            
            // Reload files if message has attachment
            if (data.message.file_url) {
                loadConversationFiles(selectedConversation.id);
            }
        } else if (data.message && data.conversation_id !== selectedConversation?.id) {
            // Message in another conversation - reload conversations to update unread counts
            loadConversations();
        }
    };
    
    //! handle message edited:
    const handleMessageEdited = (data) => {
        if (data.message && selectedConversation && data.conversation_id === selectedConversation.id) {
            setMessages(prev => 
                prev.map(msg => msg.id === data.message.id ? data.message : msg)
            );
        }
    };
    
    //! handle user typing:
    const handleUserTyping = (data) => {
        if (selectedConversation && data.conversation_id === selectedConversation.id && data.user_id !== userId) {
            setIsTyping(prev => ({
                ...prev,
                [data.user_id]: {
                    isTyping: data.is_typing,
                    userName: data.user_name || `User ${data.user_id}`
                }
            }));
    
            const timeoutKey = `typing_${data.user_id}`;
            if (window.typingTimeouts) {
                clearTimeout(window.typingTimeouts[timeoutKey]);
            } else {
                window.typingTimeouts = {};
            }
        
            if (data.is_typing) {
                window.typingTimeouts[timeoutKey] = setTimeout(() => {
                    setIsTyping(prev => ({
                        ...prev,
                        [data.user_id]: { ...prev[data.user_id], isTyping: false }
                    }));
                }, 3000);
            }
        }
    };
    
    //! handle user online:
    const handleUserOnline = (data) => {
        setOnlineUsers(prev => new Set([...prev, data.user_id]));
    };
    
    //! handle user offline:
    const handleUserOffline = (data) => {
        setOnlineUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.user_id);
            return newSet;
        });
    };
    
    //! delete message:
    const deleteMessage=async(message)=>{
        setDeletedMessage(message);
        setShowDeleteModal(true);
        
    }
    
    //! handle delete message:
    const handleDeleteMessage = async () => {
        setLoading(true);
        const token = access_token; 
        
        if (!token) {
            console.error('No access token found');
            return;
        }
        try {
            const response = await fetch(
                `${API_BASE_URL}/chat/conversations/${selectedConversation?.id}/messages/${deletedMessage?.id}?user_id=${userId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                setMessages(prev => prev.filter(msg => msg.id !== deletedMessage.id));
                loadConversations();
                setShowDeleteModal(false);
                
                setShowAlert(true);
                setAlertVariant("success");
                setAlertDismissible(true);
                setAlertMessage(data.message || data.data?.message || "Message deleted successfully");
            } else {
                throw new Error(data.message || "Failed to delete message");
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            setShowAlert(true);
            setAlertVariant("error");
            setAlertDismissible(true);
            setAlertMessage(error.message || "Failed to delete message");
        } finally {
            setLoading(false);
        }
    };

    
    //! mark conversation as read:
    const markConversationAsRead = async (conversationId) => {
        const token = access_token; 
        
        if (!token) {
            console.error('No access token found');
            return;
        }
        try {
            const response = await fetch(
                `${API_BASE_URL}/chat/conversations/${conversationId}/mark-read?user_id=${userId}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || "Failed to mark conversation as read");
            }
        } catch (error) {
            console.error('Error marking conversation as read:', error);
            throw error;
        }
    };

    
    //! handle selected conversation:
    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        
        // Mark conversation as read when selected
        if (conversation && conversation.id) {
            try {
                await markConversationAsRead(conversation.id);
                
                // Update local state to reflect read status
                setReadConversations(prev => new Set([...prev, conversation.id]));
                
                // Reload conversations to update unread counts
                loadConversations();
            } catch (error) {
                console.error('Error marking conversation as read:', error);
            }
        }
    };
    
    //! handle send message:
    const handleSendMessage = async (messageContent, file = null) => {
        if ((!messageContent?.trim() && !file) || !selectedConversation) return;
        
        setLoading(true);
        const token = access_token; 
        
        if (!token) {
            console.error('No access token found');
            setLoading(false);
            return;
        }
        
        try {
            if (file) {
                // Handle file upload
                const formData = new FormData();
                formData.append('sender_id', userId);
                formData.append('content', messageContent || 'Sent a file');
                formData.append('message_type', 'file');
                formData.append('file', file);
                
                const response = await fetch(
                    `${API_BASE_URL}/chat/conversations/${selectedConversation.id}/messages`,
                    {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        credentials: 'include',
                    }
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.success && data.data?.message) {
                    setMessages(prev => [...prev, data.data.message]);
                    loadConversations();
                    loadConversationFiles(selectedConversation.id);
                } else {
                    throw new Error(data.message || "Failed to send message");
                }
            } else {
                // Handle text message
                const response = await fetch(
                    `${API_BASE_URL}/chat/conversations/${selectedConversation.id}/messages`,
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            sender_id: userId,
                            content: messageContent,
                            message_type: 'text'
                        }),
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.success && data.data?.message) {
                    setMessages(prev => [...prev, data.data.message]);
                    loadConversations();
                } else {
                    throw new Error(data.message || "Failed to send message");
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Show error alert
            setShowAlert(true);
            setAlertVariant("error");
            setAlertDismissible(true);
            setAlertMessage(error.message || "Failed to send message");
        } finally {
            setLoading(false);
        }
    };


    //! handle typing:
    const handleTyping = (conversationId) => {
        if (wsClient.current && conversationId) {
            wsClient.current.handleTyping(conversationId);
        }
    };
    
    //! handle create conversation:
    const handleCreateConversation = async () => {
        if (selectedParticipants.length === 0) {
            alert('Please select at least one participant');
            return;
        }
        
        setLoading(true);
        const token = access_token; 
        
        if (!token) {
            console.error('No access token found');
            setLoading(false);
            return;
        }
        
        try {
            const participantIds = selectedParticipants.map(p => p.id);
            
            if (conversationType === 'direct' && participantIds.length !== 1) {
                alert('Direct messages can only have one other participant');
                setLoading(false);
                return;
            }
            
            const response = await fetch(
                `${API_BASE_URL}/chat/conversations`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        created_by_id: userId,
                        participant_ids: participantIds,
                        name: conversationType === 'group' ? newConversationName : null,
                        conversation_type: conversationType,
                        description: conversationType === 'group' ? newConversationName + ' group chat' : null
                    }),
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.data?.conversation) {
                const newConversation = data.data.conversation;
                setConversations(prev => [newConversation, ...prev]);
                setSelectedConversation(newConversation);
                setShowCreateModal(false);
                resetModal();
                
                // Load messages for the new conversation
                await loadMessages(newConversation.id);
                await loadConversationFiles(newConversation.id);
                
                // Show success alert
                setShowAlert(true);
                setAlertVariant("success");
                setAlertDismissible(true);
                setAlertMessage("Conversation created successfully");
            } else {
                throw new Error(data.message || "Failed to create conversation");
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
            alert(error.message || 'Failed to create conversation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetModal = () => {
        setNewConversationName('');
        setSelectedParticipants([]);
        setConversationType('direct');
    };
    
    
    const toggleParticipant = (usr) => {
        setSelectedParticipants(prev => {
            const isSelected = prev.some(p => p.id === usr.id);
            if (isSelected) {
            return prev.filter(p => p.id !== usr.id);
            } else {
            return [...prev, usr];
            }
        });
    };

    const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getTypingDisplay = () => {
        const typingUsers = Object.entries(isTyping)
          .filter(([uid, data]) => data.isTyping && parseInt(uid) !== userId)
          .map(([uid, data]) => data.userName || `User ${uid}`);
        
        if (typingUsers.length === 0) return null;
        if (typingUsers.length === 1) return `${typingUsers[0]} is typing...`;
        return `${typingUsers.length} people are typing...`;
      };

  const getConversationName = (conversation) => {
    if (conversation.name) return conversation.name;
    if (conversation.conversation_type === 'direct') {
      const otherParticipants = conversation.participants?.filter(p => p.id !== userId);
      return otherParticipants?.map(p => `${p.firstName || p.first_name} ${p.lastName || p.last_name}`).join(', ') || 'Direct Message';
    }
    return 'Group Chat';
  };

    const formatMessageContent = (content) => {
        if (!content) return '';
        
        // Only process if content contains time placeholders like [14:30]
        const timePattern = /\[(\d{1,2}:\d{2})\]/g;
        
        if (timePattern.test(content)) {
            const convertToAmPm = (time24) => {
                const [hours, minutes] = time24.split(':');
                let hour = parseInt(hours, 10);
                const minute = minutes;
                
                const period = hour >= 12 ? 'PM' : 'AM';
                hour = hour % 12 || 12;
                
                return `${hour}:${minute} ${period}`;
            };
            
            let formattedContent = content.replace(/\[(\d{1,2}:\d{2})\]/g, (match, time24) => {
                return convertToAmPm(time24);
            });
            
            formattedContent = formattedContent.replace(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)/gi, '<span class="inline-block px-2 py-0.5 mx-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full border border-green-500/30">$1</span>');
            
            return <span dangerouslySetInnerHTML={{ __html: formattedContent }} />;
        }
        
        // Return original content if no time placeholders found
        return content;
    };
    
    // Format timestamp based on sender's timezone and display in current user's timezone
    const formatMessageTime = (timestamp, senderTimezone, currentUserTimezone = 'UTC') => {
        if (!timestamp) return '';
        
        try {
            // Convert the timestamp from sender's timezone to current user's timezone
            const date = new Date(timestamp);
            
            // Format in current user's local timezone
            const now = new Date();
            const isToday = date.toDateString() === now.toDateString();
            
            if (isToday) {
                return date.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                });
            } else {
                return date.toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }) + ' ' + date.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                });
            }
        } catch (error) {
            console.error('Error formatting message time:', error);
            return '';
        }
    };
    
    // Get current user's timezone (you might want to get this from user settings)
    const getCurrentUserTimezone = () => {
        // You can get this from user profile, localStorage, or default to browser timezone
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    };

    const startEditMessage = (message) => {
        setEditingMessageId(message.id);
        setEditingContent(message.content);
    };

    const cancelEditMessage = () => {
        setEditingMessageId(null);
        setEditingContent('');
    };

    const saveEditMessage = async (messageId) => {
        if (!editingContent.trim()) return;

        try {
            const data = await fetch(
                `${API_BASE_URL}/chat/conversations/${selectedConversation.id}/messages/${messageId}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        content: editingContent,
                        user_id: userId
                    }),
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success && data.data.message) {
                setMessages(prev => 
                    prev.map(msg => msg.id === messageId ? data.data.message : msg)
                );
                setEditingMessageId(null);
                setEditingContent('');
            }
        } catch (error) {
            console.error('Error editing message:', error);
        }
    };

    const getFileIcon = (fileType) => {
        if (fileType?.startsWith('image/')) return <Image size={20} className="text-blue-400" />;
        if (fileType === 'application/pdf') return <FileText size={20} className="text-red-400" />;
        return <File size={20} className="text-gray-400" />;
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const Notification = () => {
        if (!notification.show) return null
    
        const styles = {
          error: 'border-red-400 bg-red-500/10 text-red-200',
          success: 'border-green-400 bg-green-500/10 text-green-200',
          warning: 'border-yellow-400 bg-yellow-500/10 text-yellow-200'
        }
    
        return (
          <div className="fixed top-4 right-4 z-999999" style={{ zIndex: 999999999999 }}>
            <Alert className={styles[notification.type]}>
              <AlertDescription className="font-medium">
                {notification.message}
              </AlertDescription>
            </Alert>
          </div>
        )
      }
      
      const showNotification = (type, message) => {
        setNotification({ show: true, type, message })
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000)
      }
      
    useEffect(() => {
        fetchUsers(1);
    }, [searchQuery, selectedRole, selectedStatus]);
    
    return (
        <div className="chat-app   flex relative font-sans">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
                <div className="absolute top-1/4 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
                <div className="absolute top-1/3 -right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>
            
            <ScrollToTop/>
            <Notification />
            
            {/* <AnimatedNotification
              autoGenerate={true}
              maxNotifications={3}
              variant="glass"
              position="top-right"
              showAvatars={true}
              allowDismiss={true}
              customMessages={["Welcome!", "Task completed!"]}
              onNotificationClick={(notification) => console.log(notification)}
            /> */}
            {/* Create Conversation Modal */}
            {showCreateModal && (
                <div style={{zIndex:999999999999999}} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-gray-800">
                        <div className="sticky top-0 bg-[#1a1a1a]/95 backdrop-blur-xl border-b border-gray-800 p-6 rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-white">
                                Create New Conversation
                            </h2>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    Conversation Type
                                </label>
                                <select 
                                    value={conversationType} 
                                    onChange={(e) => setConversationType(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#c1ff72] transition-all duration-300"
                                >
                                    <option value="direct">Direct Message</option>
                                    <option value="group">Group Chat</option>
                                </select>
                            </div>

                            {conversationType === 'group' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                                        Group Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newConversationName}
                                        onChange={(e) => setNewConversationName(e.target.value)}
                                        placeholder="Enter group name"
                                        className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#c1ff72] transition-all duration-300"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    {conversationType === 'direct' ? 'Select Participant' : 'Select Participants'}
                                </label>
                                <div className="w-full" data-aos='fade' data-aos-delay="500" style={{zIndex:99999999999999}}>
                                    {/* Search Bar */}
                                    <div className="flex-1 my-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                            placeholder="Search user or conversation..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 bg-gray-700 border-gray-600 text-white w-full"
                                            style={{ minWidth: '200px' }}
                                            />
                                        </div>
                                    </div>
                                    {selectedParticipants.length > 0 && (
                                        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-2">
                                            <span className="text-sm font-semibold text-gray-300">Selected: </span>
                                            <span className="text-sm text-gray-400">
                                                {selectedParticipants.map(p => `${p.firstName} ${p.lastName}`).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto bg-[#0f0f0f] rounded-xl border border-gray-800">
                                    {users
                                        .filter(u => u.id !== userId)
                                        .map(u => (
                                            <div 
                                                key={u.id}
                                                className={`flex items-center p-4 cursor-pointer transition-all duration-300 border-b border-gray-800 last:border-b-0 hover:bg-gray-900 group ${
                                                    selectedParticipants.some(p => p.id === u.id) 
                                                        ? 'bg-[#c1ff72]/10 border-l-4 border-l-[#c1ff72]' 
                                                        : ''
                                                }`}
                                                onClick={() => {
                                                    if (conversationType === 'direct') {
                                                        setSelectedParticipants([u]);
                                                    } else {
                                                        toggleParticipant(u);
                                                    }
                                                }}
                                            >
                                                <div className="w-12 h-12 rounded-full bg-linear-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold text-sm mr-4">
                                                    <img
                                                      className="rounded-full h-full w-full"
                                                      alt="user"
                                                      src={
                                                        u?.profilePicture
                                                        //   ? u.profilePicture
                                                        //     ? u.profilePicture
                                                        //     : `${BASE_URL}/${u.profilePicture}`
                                                        //   : "/default-avatar.png" // fallback image
                                                      }
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-white">{u.firstName} {u.lastName}</div>
                                                    <div className="text-sm text-gray-400">{u.email}</div>
                                                </div>
                                                <div className="text-xs px-3 py-1 flex flex-col">
                                                    <div className="text-xs w-30 text-black bg-white px-3 flex items-center justify-center rounded-full mb-2">
                                                        {u.timezone?u.timezone:<small style={{fontSize:'10px'}}>No timezone</small>}
                                                    </div>
                                                    <div className="text-xs w-30 text-black bg-white px-3 flex items-center justify-center rounded-full">
                                                        {u.role?u.role:<small style={{fontSize:'10px'}}>No role</small>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            
                        </div>

                        <div className="sticky bottom-0 bg-[#1a1a1a]/95 backdrop-blur-xl border-t border-gray-800 p-6 rounded-b-2xl flex gap-3 justify-end">
                            <button 
                                onClick={() => setShowCreateModal(false)}
                                className="px-6 rounded-md h-10 hover:scale-102 hover:shadow-[0px_0px_10px_red] bg-red-400 text-red-950 cursor-pointer font-semibold transition-all duration-400"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleCreateConversation}
                                disabled={selectedParticipants.length === 0}
                                className="px-6  rounded-md h-10 hover:scale-102 hover:shadow-[0px_0px_10px_white] bg-white text-black cursor-pointer font-semibold transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Conversation
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {showDeleteModal && (
                <div style={{zIndex: 99999999999999}} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="animate-in fade-in-90 zoom-in-95 duration-200">
                        <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 overflow-hidden">
                            {/* Header with Warning Icon */}
                            <div className="p-6 border-b border-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                                        <RiDeleteBin6Line size={24} className="text-red-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1">Delete Message</h2>
                                        <p className="text-gray-400 text-sm">This action cannot be undone.</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Warning Message */}
                            <div className="p-4 bg-red-500/5 border-l-4 border-red-500 mx-6 mt-4 rounded-r-lg">
                                <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-red-400 text-sm font-medium">Warning: This will permanently delete the message.</p>
                                </div>
                            </div>
            
                            {/* Actions */}
                            <div className="p-6 flex gap-3 justify-end">
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition-all duration-200 border border-gray-600 hover:border-gray-500"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDeleteMessage}
                                    className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
                                >
                                    Delete Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Sidebar */}
            <div style={{zIndex:9999}} className="flex w-full h-full">
                {/* {showAlert && (
                    <div style={{zIndex:9999}} className="fixed bottom-6 right-6 min-w-2/5">
                        <Alert
                            variant={alertVariant}
                            // title={alertTitle}
                            message={alertMessage}
                            showIcon={alertShowIcon}
                            dismissible={alertDismissible}
                            actions={alertActions}
                        />
                    </div>
                )} */}
                
                <div className="w-80  h-screen  border-r border-gray-900 flex flex-col">
                    {/* User Header */}
                    <div className="p-4 border-b border-gray-900">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-300 to-purple-300 flex items-center justify-center border-blue-400 border-2 text-black font-bold">
                                    <img
                                        className="rounded-full h-full w-full"
                                        alt="user"
                                        src={
                                        user?.profile.picture
                                        //   ? u.profilePicture
                                        //     ? u.profilePicture
                                        //     : `${BASE_URL}/${u.profilePicture}`
                                        //   : "/default-avatar.png" // fallback image
                                        }
                                    />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f0f]"></div>
                                </div>
                                <div>
                                    <div className="text-white font-semibold">
                                        {users.find(u => u.id === userId)?.firstName} {users.find(u => u.id === userId)?.lastName}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {users.find(u => u.id === userId)?.email}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div data-aos='fade' data-aos-delay="300">
                          <ShineButton 
                            className="rounded-md flex gap-2 w-full items-center justify-center text-white"
                            label="New Chat" 
                            icon={<Plus size={18} className="hover:animate-pulse" />}
                            size="sm" 
                            bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)" 
                            onClick={() => setShowCreateModal(true)} 
                          />
                        </div>
                        {/* <Button 
                            onClick={() => setShowCreateModal(true)}
                            className="px-8 w-full py-4 rounded-md bg-white hover:shadow-[0px_0px_10px_white] hover:bg-white  text-black font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                            // className="w-full py-2.5 rounded-xl bg-linear-to-br from-blue-300 to-purple-300 text-black font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            New Chat
                        </Button> */}
                        
                        <div className="w-full" data-aos='fade' data-aos-delay="500">
                            {/* Search Bar */}
                            <div className="flex-1 my-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                    placeholder="Search user or conversation..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-gray-700 border-blue-400 border text-white w-full"
                                    style={{ minWidth: '200px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
        
                    <div className="flex-1  overflow-y-auto" data-aos='fade' data-aos-delay="700">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <div className="flex flex-col gap-6">
                                    {[...Array(3)].map((_, i) => (
                                    <ConversationsCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) 
                            // conversations.length === 0 ? (
                            //     <motion.div
                            //         initial={{ opacity: 0, scale: 0.95 }}
                            //         animate={{ opacity: 1, scale: 1 }}
                            //         exit={{ opacity: 0, scale: 0.95 }}
                            //         className="flex flex-col items-center justify-center py-20"
                            //     >
                            //         <div className="w-20 h-20 bg-linear-to-br from-blue-500/10 to-blue-600/10 rounded-2xl flex items-center justify-center mb-4">
                            //         <Search className="w-10 h-10 text-blue-500" />
                            //         </div>
                            //         <h3 className="text-xl font-semibold text-white mb-2">No conversations found</h3>

                            //     </motion.div>
                            // ) 
                            : (
                                <motion.div 
                                    layout
                                    className="flex flex-col  gap-6"
                                >
                                    {conversations.map(conversation => (
                                        <div
                                            key={conversation.id}
                                            className={`flex items-center p-4 cursor-pointer transition-all duration-200 border-b border-gray-900 hover:bg-gray-900 ${
                                                selectedConversation?.id === conversation.id 
                                                    ? 'bg-gray-900 border-l-4 border-l-blue-300' 
                                                    : ''
                                            }`}
                                            onClick={() => handleSelectConversation(conversation)}
                                        >
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${
                                                selectedConversation?.id === conversation.id
                                                    ? 'bg-linear-to-br from-blue-300 to-purple-300 text-black'
                                                    : 'bg-gray-800 text-gray-300'
                                            }`}>
                                                {/* {getConversationName(conversation).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)} */}
                                                <img
                                                    className="rounded-full border border-blue-300 h-full w-full"
                                                    alt="user"
                                                    src={
                                                    conversation.participants.find((u)=>u.id!==userId)?.
                                                    profilePicture
                                                    //   ? u.profilePicture
                                                    //     ? u.profilePicture
                                                    //     : `${BASE_URL}/${u.profilePicture}`
                                                    //   : "/default-avatar.png" // fallback image
                                                    }
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 relative">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="font-semibold text-white truncate">
                                                        {getConversationName(conversation)}
                                                    </div>
                                                    {conversation.unread_count > 0 && (
                                                        
                                                        <Badge
                                                            className="ml-2 shadow-md shadow-amber-100 text-black text-xs font-bold  py-0.5 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums animate-bounce"
                                                            variant="secondary"
                                                        >
                                                            {conversation.unread_count}
                                                        </Badge>
                                                        // <div className="ml-2 bg-[#c1ff72] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                                                            
                                                        // </div>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-400 truncate">
                                                    {/* Show original content without time processing for preview */}
                                                    {formatMessageContent(conversation.last_message?.content )|| 'No messages yet'}
                                                </div>
                                                <div className={conversation.conversation_type=="group"?"flex -space-x-2  absolute right-0 top-9": "hidden"}>
                                                    <Avatar className="size-6">
                                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                    <Avatar className="size-6">
                                                        <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
                                                        <AvatarFallback>LR</AvatarFallback>
                                                    </Avatar>
                                                    <Avatar className="size-6">
                                                        <AvatarImage
                                                            src="https://github.com/evilrabbit.png"
                                                            alt="@evilrabbit"
                                                        />
                                                        <AvatarFallback>ER</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                    </div>
                </div>
    
                {/* Main Chat Area */}
                <div className="flex-1 h-screen  flex flex-col ">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="bg-[#0f0f0f] border-b border-gray-900 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center font-bold text-white">
                                            {getConversationName(selectedConversation).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">
                                                {getConversationName(selectedConversation)}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <span>{selectedConversation.participants?.length} members</span>
                                                {selectedConversation.participants?.some(p => onlineUsers.has(p.id.toString())) && (
                                                    <span className="flex items-center gap-1 text-green-500">
                                                        <Circle size={6} className="fill-green-500" />
                                                        Online
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => alert('Voice call coming soon!')}
                                            className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all duration-200 relative group cursor-not-allowed"
                                            title="Voice call (Coming soon)"
                                        >
                                            <Phone size={20} />
                                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Coming soon
                                            </span>
                                        </button>
                                        <button 
                                            onClick={() => alert('Video call coming soon!')}
                                            className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all duration-200 relative group cursor-not-allowed"
                                            title="Video call (Coming soon)"
                                        >
                                            <Video size={20} />
                                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Coming soon
                                            </span>
                                        </button>
                                        <button className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all duration-200">
                                            <Star size={20} />
                                        </button>
                                        <button className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all duration-200">
                                            <Search size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
    
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 ">
                                {loading ? (
                                        <div className="flex flex-col gap-6" style={{zIndex:999999}}>
                                            {[...Array(3)].map((_, i) => (
                                            <MessagesSkeleton key={i} />
                                            ))}
                                        </div>
                                    // <div className="h-full flex items-center justify-center">
                                    //     <div className="text-center">
                                    //         <MessageCircle size={64} className="mx-auto mb-4 text-gray-700" />
                                    //         <p className="text-gray-500 text-lg">No messages yet. Start the conversation!</p>
                                    //     </div>
                                    // </div>
                                ) : (
                                    messages.map(message => (
                                        <div className="flex-col gap-2 ">
                                            <div 
                                                key={message.id}
                                                className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                                                onMouseEnter={() => setHoveredMessageId(message.id)}
                                                onMouseLeave={() => setHoveredMessageId(null)}
                                            >
                                                <div className={` max-w-[70%] ${message.sender_id === userId ? 'items-end' : 'items-start'} flex flex-col`}>
                                                    <div className={`${message.sender_id === userId?'flex-row-reverse flex gap-2  mb-1 px-1 items-center':'flex  items-center gap-2 mb-1 px-1'}`}>
                                                        {/* Display timestamp converted from sender's timezone to current user's timezone */}
                                                        <span className="text-xs text-gray-600 mr-5">
                                                            {formatMessageTime(
                                                                message.created_at, 
                                                                message.sender_timezone, 
                                                                getCurrentUserTimezone()
                                                            )}
                                                        </span>
                                                        <span className="text-xs font-semibold text-gray-500 mr-5">
                                                            {message.sender?.firstName || message.sender?.first_name} {message.sender?.lastName || message.sender?.last_name}
                                                        </span>
                                                        {message.sender_id === userId && hoveredMessageId === message.id && editingMessageId !== message.id && (
                                                            <div  className="flex items-center gap-2">
                                                            {/* Edit Button with Tippy */}
                                                            <Tippy
                                                                theme='custom'
                                                                // sticky={true}
                                                                content="Edit message"
                                                                placement="bottom"
                                                                delay={[100, 50]}
                                                                duration={[200, 150]}
                                                                arrow={false}
                                                            >
                                                                <button
                                                                    onClick={() => startEditMessage(message)}
                                                                    className="p-2 rounded-full cursor-pointer bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all duration-200"
                                                                >
                                                                    <Edit2 size={12} />
                                                                </button>
                                                            </Tippy>
                                                            
                                                            {/* Delete Button with Tippy */}
                                                            <Tippy
                                                                content="Delete message"
                                                                placement="bottom"
                                                                theme='custom'
                                                                delay={[100, 50]}
                                                                duration={[200, 150]}
                                                                arrow={false}
                                                            >
                                                                <button
                                                                    onClick={() => deleteMessage(message)}
                                                                    className="p-2 rounded-full cursor-pointer bg-red-800/70 hover:bg-red-700/70 text-gray-400 transition-all duration-200"
                                                                >
                                                                    <RiDeleteBin6Line size={12} />
                                                                </button>
                                                            </Tippy>
                                                            
    
                                                        </div>
                                                        )}
                                                    </div>
                                                    
                                                    {editingMessageId === message.id ? (
                                                        <div style={{width:'350px'}} className=" bg-[#1a1a1a] rounded-2xl border border-gray-800 p-4 shadow-lg">
                                                            <textarea
                                                                value={editingContent}
                                                                onChange={(e) => setEditingContent(e.target.value)}
                                                                className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-blue-400 transition-all duration-300 resize-none"
                                                                rows={3}
                                                                autoFocus
                                                            />
                                                            <div className="w-full flex gap-2 mt-3 items-center justify-around">
                                                                <button
                                                                    onClick={cancelEditMessage}
                                                                    className="w-full flex justify-center items-center p-2 rounded-md bg-red-800  hover:shadow-[0px_0px_10px_red] text-gray-300 transition-all duration-200"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => saveEditMessage(message.id)}
                                                                    disabled={!editingContent.trim()}
                                                                    style={{background:'linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)'}}
                                                                    className="w-full flex justify-center items-center p-2 rounded-md hover:scale:102 hover:shadow-blue-400 hover:shadow-[0px_0px_10px_blue]  text-black transition-all duration-200 disabled:opacity-50"
                                                                >
                                                                    <Check size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={`${message.sender_id === userId?'flex-row-reverse flex gap-2':'flex gap-2'}`}>
                                                            <Avatar className="size-10 border border-blue-400 text-black font-bold flex items-center justify-center">
                                                            {/* {(message.sender?.firstName || message.sender?.first_name)?.[0]}{(message.sender?.lastName || message.sender?.last_name)?.[0]} */}
                                                                <AvatarImage src={message?.sender?.profilePicture} alt="@shadcn" />
                                                                <AvatarFallback>{(message.sender?.firstName || message.sender?.first_name)?.[0]}{(message.sender?.lastName || message.sender?.last_name)?.[0]}</AvatarFallback>
                                                            </Avatar>
                                                            <div className={`px-5 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                                                                message.sender_id === userId
                                                                    ? 'bg-white text-black'
                                                                    : 'bg-[#1a1a1a] text-white border border-gray-800'
                                                            }`}>
                                                                
                                                                {message.file_url && (
                                                                    <div className="mb-2">
                                                                    {/* {alert(message.file_url)} */}
                                                                        {message.file_type?.startsWith('image/') ? (
                                                                            <img 
                                                                                src={message.file_url.startsWith("http")
                                                                                    ? message.file_url
                                                                                    : `${SOCKET_API_URL}${message.file_url}`} 
                                                                                alt={message.file_name}
                                                                                className="max-w-full rounded-lg mb-2"
                                                                            />
                                                                        ) : (
                                                                            <div className="flex items-center gap-2 bg-black/20 p-3 rounded-lg">
                                                                                {getFileIcon(message.file_type)}
                                                                                <div className="flex-1">
                                                                                    <div className="font-semibold text-sm">{message.file_name}</div>
                                                                                    <div className="text-xs opacity-70">{formatFileSize(message.file_size)}</div>
                                                                                </div>
                                                                                <a 
                                                                                    href={message.file_url} 
                                                                                    download
                                                                                    className="p-2 rounded-lg hover:bg-black/20 transition-all"
                                                                                >
                                                                                    <Download size={16} />
                                                                                </a>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                <div className="leading-relaxed">
                                                                    {formatMessageContent(message.content)}
                                                                </div>
                                                                {message.is_edited && (
                                                                    <div className="mt-2 text-xs opacity-70 italic">
                                                                        (edited)
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <Actions className={`flex mt-1  ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}>
                                                {actions.map((action) => (
                                                  <Action key={action.label} label={action.label} tooltip={action.label} className={"rounded-full"}>
                                                    <action.icon className="size-3.5" />
                                                  </Action>
                                                ))}
                                              </Actions>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                                
                                {getTypingDisplay() && (
                                    <div className="flex items-center gap-3 px-5 py-3 bg-[#1a1a1a] rounded-2xl border border-gray-800 max-w-fit">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></span>
                                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></span>
                                        </div>
                                        <span className="text-sm text-gray-400 italic">{getTypingDisplay()}</span>
                                    </div>
                                )}
                            </div>
    
                            {/* Message Input */}
                            <div className="p-4">
                                <TimeAwareMessageInput
                                    onSend={handleSendMessage}
                                    onTyping={handleTyping}
                                    conversationId={selectedConversation?.id}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center space-y-6">
                                <div className="w-24 h-24 mx-auto bg-gray-900 rounded-3xl flex items-center justify-center">
                                    <MessageCircle size={48} className="text-gray-700" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-3">Welcome to Chat</h2>
                                    <p className="text-gray-500 mb-6">Select a conversation or create a new one to start chatting</p>
                                    <Button 
                                        onClick={() => setShowCreateModal(true)}
                                        className="px-8 py-4 rounded-md bg-white hover:shadow-[0px_0px_10px_white] hover:bg-white  text-black font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                                    >
                                        Start New Conversation
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar - Members & Files */}
                {selectedConversation && (
                    <div className={` border-l h-screen border-gray-900   flex flex-col overflow-y-auto transition-all duration-300 ${
                        isSidebarCollapsed ? 'w-0 opacity-0' : 'w-80 opacity-100'
                    }`}>
                        {/* Toggle Button */}
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className={`absolute w-16 top-4  z-10 p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all duration-300 border border-gray-700 ${
                                isSidebarCollapsed 
                                    ? 'right-12 rotate-180' 
                                    : 'right-12 '
                            }`}
                            style={{zIndex:9999999999}}
                            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            <ChevronRight size={16} />
                        </button>
                
                        {/* Sidebar Content */}
                        <div className={`${isSidebarCollapsed ? 'hidden' : 'block'} h-full`}>
                            {/* Members Section */}
                            <div className="p-4 border-b border-gray-900">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        <Users size={18} />
                                        Members
                                    </h3>
                                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                                        {selectedConversation.participants?.length}
                                    </span>
                                </div>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {selectedConversation.participants?.map(participant => {
                                        const usr = users.find(u => u.id === participant.id) || participant;
                                        const isOnline = onlineUsers.has(participant.id.toString());
                                        const isCurrentUser = participant.id === userId;
                                        
                                        return (
                                            <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-900 transition-all">
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-semibold text-sm">
                                                        {/* {(usr.firstName || usr.first_name)?.[0]}{(usr.lastName || usr.last_name)?.[0]} */}
                                                        <Avatar className="size-10 bg-linear-to-br from-blue-300 to-purple-300 text-black font-bold flex items-center justify-center">
                                                            {/* {(message.sender?.firstName || message.sender?.first_name)?.[0]}{(message.sender?.lastName || message.sender?.last_name)?.[0]} */}
                                                                <AvatarImage src={participant?.profilePicture} alt="@shadcn" />
                                                                <AvatarFallback>{(participant?.firstName || participant?.first_name)?.[0]}{(participant?.lastName || participant?.last_name)?.[0]}</AvatarFallback>
                                                            </Avatar>
                                                    </div>
                                                    {isOnline && (
                                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f0f]"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-white text-sm font-medium flex items-center gap-2">
                                                        <span className="truncate">
                                                            {usr.firstName || usr.first_name} {usr.lastName || usr.last_name}
                                                        </span>
                                                        {isCurrentUser && (
                                                            <span className="shrink-0 text-xs bg-[#c1ff72] text-black px-2 py-0.5 rounded-full font-semibold">
                                                                You
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {isOnline ? 'Online' : 'Offline'}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                
                            {/* Files Section */}
                            <div className="p-4 border-b border-gray-900">
                                <button
                                    onClick={() => setShowFilesExpanded(!showFilesExpanded)}
                                    className="w-full flex items-center justify-between text-white font-bold mb-3 hover:text-[#c1ff72] transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        <Image size={18} />
                                        <span>{conversationFiles.filter(f => f.file_type?.startsWith('image/')).length} photos</span>
                                    </div>
                                    {showFilesExpanded ? 
                                        <ChevronUp size={16} className="text-gray-400 group-hover:text-[#c1ff72]" /> : 
                                        <ChevronDown size={16} className="text-gray-400 group-hover:text-[#c1ff72]" />
                                    }
                                </button>
                                
                                {showFilesExpanded && (
                                    <div className="grid grid-cols-2 gap-2 animate-in fade-in-50 duration-200">
                                        {conversationFiles
                                        .filter(file => file.file_type?.startsWith('image/'))
                                        .slice(0, 4)
                                        .map((file, idx) => {
                                            const imageUrl = file.file_url.startsWith('http') 
                                                ? file.file_url 
                                                : `${SOCKET_API_URL}${file.file_url}`;
                                            
                                            return (
                                                <div 
                                                    key={idx} 
                                                    className="aspect-square rounded-lg overflow-hidden bg-gray-900 hover:opacity-80 transition-all duration-200 cursor-pointer group relative"
                                                >
                                                    <img 
                                                        src={imageUrl} 
                                                        alt={file.file_name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.parentElement.innerHTML = `
                                                                <div class="w-full h-full flex items-center justify-center text-gray-500 bg-gray-800">
                                                                    <Image size={20} class="text-gray-600 mb-1" />
                                                                    <span class="text-xs">Failed to load</span>
                                                                </div>
                                                            `;
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <Eye size={16} className="text-white" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                
                            {/* All Files Section */}
                            <div className="p-4">
                                <button
                                    onClick={() => setShowLinksExpanded(!showLinksExpanded)}
                                    className="w-full flex items-center justify-between text-white font-bold mb-3 hover:text-[#c1ff72] transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        <File size={18} />
                                        <span>{conversationFiles.length} files</span>
                                    </div>
                                    {showLinksExpanded ? 
                                        <ChevronUp size={16} className="text-gray-400 group-hover:text-[#c1ff72]" /> : 
                                        <ChevronDown size={16} className="text-gray-400 group-hover:text-[#c1ff72]" />
                                    }
                                </button>
                                
                                {showLinksExpanded && (
                                    <div className="space-y-2 max-h-96 overflow-y-auto animate-in fade-in-50 duration-200">
                                        {conversationFiles.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                <File size={32} className="mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No files shared yet</p>
                                            </div>
                                        ) : (
                                            conversationFiles.map((file, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer group"
                                                >
                                                    <div className="flex-shrink-0">
                                                        {getFileIcon(file.file_type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-white text-sm font-medium truncate">
                                                            {file.file_name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                                            {formatFileSize(file.file_size)}
                                                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                                            {new Date(file.uploaded_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <a 
                                                        href={file.file_url} 
                                                        download
                                                        className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-700 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                        onClick={(e) => e.stopPropagation()}
                                                        title="Download file"
                                                    >
                                                        <Download size={16} className="text-gray-400 hover:text-white" />
                                                    </a>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Debug Controls
            {process.env.NODE_ENV === 'development' && selectedConversation && (
                <div className="fixed bottom-4 right-4 flex gap-2 z-50">
                    <button 
                        onClick={() => {
                            handleUserTyping({
                                conversation_id: selectedConversation?.id,
                                user_id: 12,
                                user_name: 'Jane Smith',
                                is_typing: true
                            });
                        }}
                        className="px-4 py-2 rounded-xl bg-red-500/90 hover:bg-red-600 text-white text-sm font-medium transition-all duration-200 backdrop-blur-xl"
                    >
                        Test Typing
                    </button>
                    <button 
                        onClick={() => {
                            handleUserTyping({
                                conversation_id: selectedConversation?.id,
                                user_id: 12,
                                user_name: 'Jane Smith', 
                                is_typing: false
                            });
                        }}
                        className="px-4 py-2 rounded-xl bg-red-500/90 hover:bg-red-600 text-white text-sm font-medium transition-all duration-200 backdrop-blur-xl"
                    >
                        Test Stop Typing
                    </button>
                </div>
            )} */}
        </div>
    );
};

export default ChatComponent;