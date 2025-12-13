import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Paperclip, Smile, Check, CheckCheck } from 'lucide-react';
import { BiSolidMessageEdit } from "react-icons/bi";

// Mock team members data
const teamMembers = [
  { id: 1, name: 'Sarah Chen', avatar: '👩‍💼', status: 'online' },
  { id: 2, name: 'Mike Johnson', avatar: '👨‍💻', status: 'online' },
  { id: 3, name: 'Lisa Wang', avatar: '👩‍🦰', status: 'away' },
  { id: 4, name: 'Tom Davis', avatar: '👨‍🔧', status: 'offline' }
];

// Message Bubble Component
const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex items-end gap-2 mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm flex-shrink-0">
          {message.avatar}
        </div>
      )}
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {!isOwn && <span className="text-xs text-gray-500 mb-1 px-1">{message.sender}</span>}
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isOwn
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-800 rounded-bl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        <div className="flex items-center gap-1 mt-1 px-1">
          <span className="text-xs text-gray-400">{message.time}</span>
          {isOwn && (
            <div className="text-blue-500">
              {message.read ? <CheckCheck size={14} /> : <Check size={14} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Typing Indicator Component
const TypingIndicator = () => {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
        👩‍💼
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

// Message List Component
const MessageList = ({ messages, isTyping }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} isOwn={message.isOwn} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

// Message Input Component
const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
      <div className="flex items-end gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Paperclip size={20} className="text-gray-500" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Smile size={20} className="text-gray-500" />
        </button>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          style={{ maxHeight: '120px' }}
        />
        <button
          onClick={handleSend}
          className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Send size={20} />
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">Press Enter to send, Shift+Enter for new line</p>
    </div>
  );
};

// Chat Header Component
const ChatHeader = ({ onClose }) => {
  const onlineMembers = teamMembers.filter(m => m.status === 'online');
  const visibleMembers = onlineMembers.slice(0, 3);
  const remainingCount = onlineMembers.length - 3;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">Support Team</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-100">Online now</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {visibleMembers.map((member) => (
            <div
              key={member.id}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center text-sm"
              title={member.name}
            >
              {member.avatar}
            </div>
          ))}
          {remainingCount > 0 && (
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center text-xs font-semibold">
              +{remainingCount}
            </div>
          )}
        </div>
        <span className="text-sm text-blue-100 ml-2">
          {onlineMembers.length} team member{onlineMembers.length !== 1 ? 's' : ''} available
        </span>
      </div>
    </div>
  );
};

// Chat Window Component
const ChatWindow = ({ onClose, messages, onSendMessage, isTyping }) => {
  return (
    <div style={{zIndex:9999999999}} className="fixed bottom-22 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col animate-slideUp z-50 max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)]">
      <ChatHeader onClose={onClose} />
      <MessageList messages={messages} isTyping={isTyping} />
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

// Floating Button Component
const FloatingButton = ({ onClick, hasUnread }) => {
  return (
    <button
      onClick={onClick}
      style={{background:'white',zIndex:999999999999}}
      className="fixed bottom-8 right-12 w-13 h-13 group shadow-2xl hover:shadow-blue-500/50  transition-all duration-700 hover:shadow-[0px_0px_10px_#FFFFFF]  rounded-full  flex items-center justify-center hover:scale-110">

      {/* <MessageCircle size={28} className="group-hover:scale-110 transition-transform" /> */}
      {/* <img src="/chat.png" className='p-2 group-hover:scale-105 transition-all duration-1000  ' alt="" />  */}
      <BiSolidMessageEdit size={25} className='text-blue-500' />
      {hasUnread && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-4 border-white animate-pulse flex items-center justify-center">
          <span className="text-xs font-bold">1</span>
        </div>
      )}
      {/* <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div> */}
    </button>
  );
};

// Main App Component
const FloatingChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  useEffect(() => {
    if (isOpen && !hasShownWelcome) {
      setTimeout(() => {
        const welcomeMessage = {
          id: Date.now(),
          text: "Hi there! 👋 Welcome to our support chat. How can we help you today?",
          sender: "Sarah Chen",
          avatar: "👩‍💼",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: false,
          read: false
        };
        setMessages([welcomeMessage]);
        setHasShownWelcome(true);
      }, 500);
    }
  }, [isOpen, hasShownWelcome]);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      read: false
    };
    setMessages([...messages, newMessage]);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, read: true } : msg
      ));
    }, 1000);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Thanks for reaching out! Let me check that for you.",
        "I understand. I'll help you with that right away.",
        "Great question! Here's what I can tell you...",
        "I'm on it! Give me just a moment to look into this.",
      ];
      const response = {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "Sarah Chen",
        avatar: "👩‍💼",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        read: false
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setHasUnread(false);
  };

  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const timer = setTimeout(() => {
        setHasUnread(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages]);

  return (
    <div className="min-h-screenp-8 option-b option">
      

      {isOpen && (
        <ChatWindow
          onClose={handleToggle}
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
        />
      )}
      
      {!isOpen && <FloatingButton onClick={handleToggle} hasUnread={hasUnread} />}

      <style >{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default FloatingChatbox;