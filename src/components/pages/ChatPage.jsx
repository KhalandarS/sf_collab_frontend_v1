import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, MoreHorizontal, Phone, Video, Info, Smile, X, CornerUpLeft, MessageSquare as MessageSquareIcon, Bell, Sparkles, Palette } from 'lucide-react';

// Mock Data
const conversations = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'Sounds good! Let\'s sync up tomorrow.',
    timestamp: '10m',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Mike Chen',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'You: Can you review the latest PR?',
    timestamp: '1h',
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: 'Emma Davis',
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastMessage: 'Thanks for the feedback!',
    timestamp: '3h',
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: 'Project Alpha Team',
    avatar: 'https://i.pravatar.cc/150?img=8',
    lastMessage: 'Alex: Don\'t forget the meeting at 3 PM.',
    timestamp: 'yesterday',
    unread: 0,
    online: false,
  },
];

const messages = {
  1: [
    { id: 1, text: 'Hey, how is the project going?', sender: 'other', timestamp: '10:30 AM' },
    { id: 2, text: 'It\'s going well! Just pushed a new update.', sender: 'me', timestamp: '10:31 AM' },
    { id: 3, text: 'Great, I will check it out.', sender: 'other', timestamp: '10:32 AM' },
    { id: 4, text: 'Sounds good! Let\'s sync up tomorrow.', sender: 'other', timestamp: '10:35 AM' },
  ],
  2: [
    { id: 1, text: 'Can you review the latest PR?', sender: 'me', timestamp: '9:15 AM' },
  ],
  3: [
    { id: 1, text: 'I\'ve reviewed the design mockups. They look fantastic!', sender: 'me', timestamp: '6:00 AM' },
    { id: 2, text: 'Thanks for the feedback!', sender: 'other', timestamp: '6:05 AM' },
  ],
  4: [
     { id: 1, text: 'Don\'t forget the meeting at 3 PM.', sender: 'other', timestamp: 'yesterday' },
  ]
};

const ChatSettingsMenu = ({ currentSettings, onSettingsChange, onClose }) => {
  const [stagedSettings, setStagedSettings] = useState(currentSettings);
  const [activeCategory, setActiveCategory] = useState(null); // null represents the main menu

  const handleAnimationChange = (animation) => {
    setStagedSettings(prev => ({
      ...prev,
      textAnimation: { ...prev.textAnimation, [animation]: !prev.textAnimation[animation] }
    }));
  };


  const handleThemeChange = (theme) => setStagedSettings(prev => ({ ...prev, theme }));

  const solidColors = ['#0A0A0A', '#1a2639', '#4a044e', '#044e42'];
  const gradients = [
    'linear-gradient(to top right, #3b82f6, #8b5cf6)',
    'linear-gradient(to top right, #10b981, #f59e0b)',
    'linear-gradient(to top right, #ec4899, #ef4444)',
    'linear-gradient(to top right, #6366f1, #a855f7, #d946ef)',
  ];
  const images = [
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1488866022504-f2584929ca5f?q=80&w=2062&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723a996f329?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=80&w=2070&auto=format&fit=crop',
  ];

  const handleApply = () => {
    onSettingsChange(stagedSettings);
    onClose();
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-[#1A1A1A] border border-white/20 rounded-xl shadow-lg z-20">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          {activeCategory && (
            <button onClick={() => setActiveCategory(null)} className="p-1 hover:bg-white/10 rounded-full">
              <CornerUpLeft size={16} />
            </button>
          )}
          <h4 className="font-semibold text-base capitalize">
            {activeCategory ? `${activeCategory} Settings` : 'Chat Settings'}
          </h4>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-6 max-h-80 overflow-y-auto">
        {!activeCategory ? (
          <div className="space-y-2">
            <button onClick={() => setActiveCategory('theme')} className="w-full flex items-center gap-3 text-left p-3 hover:bg-white/10 rounded-lg transition-colors">
              <Palette size={18} className="text-gray-400" />
              <span>Chat Theme</span>
            </button>
            <button onClick={() => setActiveCategory('animation')} className="w-full flex items-center gap-3 text-left p-3 hover:bg-white/10 rounded-lg transition-colors">
              <Sparkles size={18} className="text-gray-400" />
              <span>Typing Animation</span>
            </button>
            <button onClick={() => setActiveCategory('notification')} className="w-full flex items-center gap-3 text-left p-3 hover:bg-white/10 rounded-lg transition-colors">
              <Bell size={18} className="text-gray-400" />
              <span>Notifications</span>
            </button>
          </div>
        ) : activeCategory === 'theme' ? (
          <div className="space-y-4">
            <h5 className="font-medium text-sm text-gray-300">Chat Theme</h5>
            <div>
              <p className="text-xs text-gray-400 mb-2">Solid Colors</p>
              <div className="flex gap-2">
                {solidColors.map(color => (
                  <button key={color} onClick={() => handleThemeChange({ type: 'color', value: color })} className={`w-8 h-8 rounded-full transition-all ${stagedSettings.theme.value === color ? 'ring-2 ring-offset-2 ring-offset-black ring-white' : 'border-2 border-transparent hover:border-white'}`} style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Gradients</p>
              <div className="flex gap-2">
                {gradients.map(gradient => (
                  <button key={gradient} onClick={() => handleThemeChange({ type: 'gradient', value: gradient })} className={`w-8 h-8 rounded-full transition-all ${stagedSettings.theme.value === gradient ? 'ring-2 ring-offset-2 ring-offset-black ring-white' : 'border-2 border-transparent hover:border-white'}`} style={{ background: gradient }} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Images</p>
              <div className="grid grid-cols-4 gap-2">
                {images.map(img => (
                  <button key={img} onClick={() => handleThemeChange({ type: 'image', value: `url(${img})` })} className={`w-full h-8 rounded-md bg-cover bg-center transition-all ${stagedSettings.theme.value === `url(${img})` ? 'ring-2 ring-offset-2 ring-offset-black ring-white' : 'border-2 border-transparent hover:border-white'}`} style={{ backgroundImage: `url(${img})` }} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Custom Color</p>
              <input
                type="color"
                value={stagedSettings.theme.type === 'color' ? stagedSettings.theme.value : '#0A0A0A'}
                onChange={(e) => handleThemeChange({ type: 'color', value: e.target.value })}
                className="w-full h-8 p-0 border-none rounded-md cursor-pointer"
              />
            </div>
          </div>
        ) : activeCategory === 'animation' ? (
          <div className="space-y-4">
            <h5 className="font-medium text-sm text-gray-300 flex items-center gap-2"><Sparkles size={14} /> Text Animations</h5>
            <div className="flex items-center justify-between">
              <label htmlFor="typing-indicator" className="text-sm text-gray-400 cursor-pointer">Show "thinking" animation</label>
              <button
                id="typing-indicator"
                onClick={() => handleAnimationChange('thinking')}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${stagedSettings.textAnimation.thinking ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${stagedSettings.textAnimation.thinking ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="fade-in" className="text-sm text-gray-400 cursor-pointer">Fade in new messages</label>
              <button
                id="fade-in"
                onClick={() => handleAnimationChange('fadeIn')}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${stagedSettings.textAnimation.fadeIn ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${stagedSettings.textAnimation.fadeIn ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="pulse-unread" className="text-sm text-gray-400 cursor-pointer">Pulse on unread</label>
              <button
                id="pulse-unread"
                onClick={() => handleAnimationChange('pulseUnread')}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${stagedSettings.textAnimation.pulseUnread ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${stagedSettings.textAnimation.pulseUnread ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        ) : activeCategory === 'notification' ? (
          <div className="space-y-2">
            <h5 className="font-medium text-sm text-gray-300 flex items-center gap-2"><Bell size={14} /> Notifications</h5>
            <div className="flex items-center justify-between">
              <label htmlFor="notif-sound" className="text-sm text-gray-400 cursor-pointer">Notification from text</label>
              <button
                id="notif-sound"
                onClick={() => setStagedSettings(prev => ({ ...prev, playNotificationSound: !prev.playNotificationSound }))}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${stagedSettings.playNotificationSound ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${stagedSettings.playNotificationSound ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <div className="p-4 border-t border-white/10 flex justify-end">
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors"
        >
          Apply Settings
        </button>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-end gap-2 p-2">
    <div className="flex items-center justify-center gap-1 bg-[#262626] px-4 py-3 rounded-3xl rounded-bl-lg">
      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
    </div>
  </div>
);

const ToastNotification = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-28 right-6 w-80 bg-[#1A1A1A] border border-white/20 rounded-xl shadow-2xl p-4 z-50">
      <button onClick={onClose} className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white">
        <X size={16} />
      </button>
      <div className="flex items-start gap-3">
        <img src={notification.avatar} alt={notification.name} className="w-10 h-10 rounded-full mt-1" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <MessageSquareIcon className="h-4 w-4 text-blue-400" />
            <h4 className="font-semibold text-white">New Message</h4>
          </div>
          <p className="text-sm text-gray-300 mt-1">
            <span className="font-medium">{notification.name}:</span> {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
};

const ChatPage = () => {
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [message, setMessage] = useState('');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [chatSettings, setChatSettings] = useState(() => {
    const savedSettings = localStorage.getItem('chatSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      theme: { type: 'color', value: '#0A0A0A' },
      playNotificationSound: true,
      textAnimation: {
        thinking: true,
        fadeIn: false,
        pulseUnread: true,
      },
    };
  });
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState(null);
  const chatEndRef = useRef(null);
  const themeMenuRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Simulate typing indicator from the other user
    setIsTyping(true);
    const typingTimer = setTimeout(() => {
      setIsTyping(false);
    }, 2500); // Show typing for 2.5 seconds

    return () => clearTimeout(typingTimer);
  }, [activeConversation]);

  // Simulate receiving a notification from another chat
  useEffect(() => {
    if (!chatSettings.playNotificationSound) return;

    const notificationTimer = setTimeout(() => {
      setToast({ name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?img=2', message: 'Just checking in!' });
    }, 8000); // Show a notification after 8 seconds

    return () => clearTimeout(notificationTimer);
  }, [chatSettings.playNotificationSound]);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('chatSettings', JSON.stringify(chatSettings));
  }, [chatSettings]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getBackgroundStyle = () => {
    if (chatSettings.theme.type === 'color') {
      return { backgroundColor: chatSettings.theme.value };
    }
    if (chatSettings.theme.type === 'gradient' || chatSettings.theme.type === 'image') {
      return { backgroundImage: chatSettings.theme.value };
    }
    return {};
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    // In a real app, you would send the message to the backend here.
    console.log(`Sending message to ${activeConversation.name}: ${message}`);
    setMessage('');
  };

  return (
    <>
    {toast && <ToastNotification notification={toast} onClose={() => setToast(null)} />}
    <div className="h-[calc(100vh-120px)] text-white flex overflow-hidden rounded-2xl border border-white/10">
      {/* Sidebar with conversation list */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-white/10 flex flex-col bg-[#1A1A1A]">
        <div className="p-4 border-b border-white/10 ">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Messages</h1>
            <div className="relative" ref={themeMenuRef}>
              <button onClick={() => setShowSettingsMenu(!showSettingsMenu)} className="p-2 hover:bg-white/10 rounded-full">
                <MoreHorizontal size={20} />
              </button>
              {showSettingsMenu && <ChatSettingsMenu currentSettings={chatSettings} onSettingsChange={setChatSettings} onClose={() => setShowSettingsMenu(false)} />}
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#232323] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {conversations.map((convo) => (
            <div
              key={convo.id}
              className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${
                activeConversation.id === convo.id ? 'bg-black/20' : 'hover:bg-black/10'
              }`}
              onClick={() => setActiveConversation(convo)}
            >
              <div className="relative">
                <img src={convo.avatar} alt={convo.name} className="w-14 h-14 rounded-full" />
                {convo.online && (
                  <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-black"></span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className={`font-semibold ${convo.unread > 0 ? 'text-white' : 'text-gray-300'}`}>{convo.name}</p>
                  <p className="text-xs text-gray-500">{convo.timestamp}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-sm truncate ${convo.unread > 0 ? 'text-gray-300' : 'text-gray-500'}`}>
                    {convo.lastMessage}
                  </p>
                  {convo.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {convo.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div
        className="flex-1 flex flex-col bg-cover bg-center transition-all duration-500"
        style={{
          ...getBackgroundStyle(),
          backgroundColor: chatSettings.theme.type !== 'color' ? 'rgba(0,0,0,0.5)' : undefined,
          backgroundBlendMode: chatSettings.theme.type !== 'color' ? 'overlay' : 'normal',
        }}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                <img src={activeConversation.avatar} alt={activeConversation.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-bold">{activeConversation.name}</p>
                  {activeConversation.online && <p className="text-xs text-green-500">Online</p>}
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <button className="hover:text-white"><Phone size={20} /></button>
                <button className="hover:text-white"><Video size={20} /></button>
                <button className="hover:text-white"><Info size={20} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                {(messages[activeConversation.id] || []).map((msg) => (
                  <div key={msg.id} className={`group flex items-center gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    {/* Menu button for 'me' messages */}
                    {msg.sender === 'me' && (
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-gray-500 hover:text-white">
                          <CornerUpLeft size={16} />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-white">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    )}

                    {/* Avatar for 'other' messages */}
                    {msg.sender === 'other' && (
                      <img src={activeConversation.avatar} alt="" className="w-8 h-8 rounded-full" />
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-3xl ${
                        msg.sender === 'me'
                          ? 'bg-blue-600 text-white rounded-br-lg'
                          : 'bg-[#262626] text-gray-200 rounded-bl-lg'
                      }`}
                    > 
                      <p className="break-words">{msg.text}</p>
                    </div>

                    {/* Menu button for 'other' messages */}
                    {msg.sender === 'other' && (
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-gray-500 hover:text-white">
                          <CornerUpLeft size={16} />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-white">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && chatSettings.textAnimation.thinking && <TypingIndicator />}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4">
              <form
                onSubmit={handleSendMessage}
                className="bg-[#1A1A1A] border border-white/20 rounded-full flex items-center px-4 py-1"
              >
                <button type="button" className="p-2 text-gray-400 hover:text-white">
                  <Smile />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message..."
                  className="flex-1 bg-transparent px-4 py-2 text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2 text-blue-500 hover:text-blue-400 disabled:text-gray-600"
                  disabled={!message.trim()}
                >
                  <Send />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 border-4 border-white/50 rounded-full flex items-center justify-center">
                <Send size={48} className="text-white/50" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">Your Messages</h2>
            <p className="mt-2 text-gray-400">Send private photos and messages to a friend or group.</p>
            <button className="mt-6 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700">
              Send Message
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ChatPage;

/*
  API Integration Notes:

  1. Fetching Conversations & Messages:
     - Use `useEffect` to fetch the user's conversations from an endpoint like `/api/chat/conversations`.
     - When a conversation is clicked, fetch its messages from `/api/chat/conversations/:id/messages`.

  2. Sending Messages:
     - The `handleSendMessage` function should make a POST request to `/api/chat/messages` with the conversation ID and message content.

  3. Real-time Updates with WebSockets (Socket.io):
     - Your `backend/README.md` mentions Socket.io. This is perfect for a chat application.
     - On the frontend, connect to the WebSocket server.
     - Listen for an event like `chat:message` to receive new messages in real-time.
     - When a new message arrives for the active conversation, add it to the messages state.
     - If it's for an inactive conversation, update the `lastMessage` and `unread` count in the conversation list.
     - Emit an event like `chat:send` when the user sends a message.

  Example WebSocket listener:

  useEffect(() => {
    const socket = io('http://localhost:5000', { auth: { token: 'your_jwt_token' } });

    socket.on('connect', () => console.log('Socket connected!'));

    socket.on('chat:message', (newMessage) => {
      // Logic to update conversations or messages state
      console.log('New message received:', newMessage);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

*/