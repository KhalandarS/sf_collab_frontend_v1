import React, { useState } from 'react';
import { Search, Plus, Video, ChevronDown, ChevronRight } from 'lucide-react';
import Avatar from './Avatar';

const OnlineContactsSidebar = ({ 
  friends, 
  onlineUsers, 
  onOpenChat, 
  onNewMessage,
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({ 
    online: true, 
    offline: false 
  });

  // Filter friends by search
  const filteredFriends = friends.filter((f) => {
    if (!searchTerm) return true;
    const name = `${f.firstName} ${f.lastName}`.toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  // Separate online and offline
  const onlineFriends = filteredFriends.filter(f => onlineUsers.includes(f.id));
  const offlineFriends = filteredFriends.filter(f => !onlineUsers.includes(f.id));

  // Toggle section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className={`w-60 bg-zinc-950 border-l border-zinc-800 flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-3 border-b border-zinc-800/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-zinc-200 text-sm">Contacts</h3>
          <div className="flex items-center gap-1">
            <button 
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
              title="Video call"
            >
              <Video size={16} />
            </button>
            <button 
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
              title="Search"
            >
              <Search size={16} />
            </button>
            <button
              onClick={onNewMessage}
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
              title="New message"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
          <input
            type="text"
            placeholder="Search contacts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-800/50 rounded-full text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {/* Online Section */}
        <div className="p-2">
          <button
            onClick={() => toggleSection('online')}
            className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-zinc-800/30 rounded-lg transition-colors"
          >
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Online ({onlineFriends.length})
            </span>
            {expandedSections.online 
              ? <ChevronDown size={14} className="text-zinc-500" /> 
              : <ChevronRight size={14} className="text-zinc-500" />
            }
          </button>

          {expandedSections.online && (
            <div className="mt-1 space-y-0.5">
              {onlineFriends.length === 0 ? (
                <p className="text-xs text-zinc-600 px-2 py-2">No contacts online</p>
              ) : (
                onlineFriends.map((friend) => (
                  <ContactItem
                    key={friend.id}
                    friend={friend}
                    isOnline={true}
                    onClick={() => onOpenChat(friend)}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Offline Section */}
        {offlineFriends.length > 0 && (
          <div className="p-2">
            <button
              onClick={() => toggleSection('offline')}
              className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-zinc-800/30 rounded-lg transition-colors"
            >
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Offline ({offlineFriends.length})
              </span>
              {expandedSections.offline 
                ? <ChevronDown size={14} className="text-zinc-500" /> 
                : <ChevronRight size={14} className="text-zinc-500" />
              }
            </button>

            {expandedSections.offline && (
              <div className="mt-1 space-y-0.5">
                {offlineFriends.slice(0, 15).map((friend) => (
                  <ContactItem
                    key={friend.id}
                    friend={friend}
                    isOnline={false}
                    onClick={() => onOpenChat(friend)}
                  />
                ))}
                {offlineFriends.length > 15 && (
                  <p className="text-xs text-zinc-600 px-2 py-1">
                    +{offlineFriends.length - 15} more
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Contact Item Sub-component
const ContactItem = ({ friend, isOnline, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-zinc-800/50 rounded-lg transition-colors group"
  >
    <Avatar
      src={friend.profilePicture}
      name={`${friend.firstName} ${friend.lastName}`}
      size="sm"
      isOnline={isOnline}
    />

    <div className="flex-1 min-w-0">
    <span className={`text-sm truncate block ${
        isOnline ? 'text-zinc-300 group-hover:text-white' : 'text-zinc-500 group-hover:text-zinc-300'
    }`}>
        {friend.firstName} {friend.lastName}
    </span>
    {!isOnline && friend.lastSeenDisplay && (
        <span className="text-[10px] text-zinc-600 block">
        {friend.lastSeenDisplay}
        </span>
    )}
    </div>
  </button>
);

export default OnlineContactsSidebar;