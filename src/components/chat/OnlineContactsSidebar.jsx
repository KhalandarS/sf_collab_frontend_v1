/**
 * OnlineContactsSidebar Component - FIXED VERSION
 * 
 * Features:
 * - ONLINE section (users who are online now)
 * - ALL USERS section (all friends/contacts)
 * - Last seen display for offline users
 * - Click to start chat
 * 
 * Put this in: src/components/chat/OnlineContactsSidebar.jsx
 */

import React, { useState } from 'react';
import { Search, Plus, Video, ChevronDown, ChevronRight, Users, Circle } from 'lucide-react';

// Avatar component
const Avatar = ({ src, name, size = 'sm', isOnline = false, showStatus = true }) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
  };

  const statusSizes = {
    xs: 'w-2 h-2 border',
    sm: 'w-2.5 h-2.5 border-[1.5px]',
    md: 'w-3 h-3 border-2',
  };

  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative inline-block flex-shrink-0">
      {src ? (
        <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover`} />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-semibold text-white`}>
          {initials || '?'}
        </div>
      )}
      {showStatus && (
        <span className={`absolute -bottom-0.5 -right-0.5 ${statusSizes[size]} rounded-full border-zinc-900 ${isOnline ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
      )}
    </div>
  );
};

// Contact Item
const ContactItem = ({ user, isOnline, onClick }) => (
  <button
    onClick={() => onClick(user)}
    className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-zinc-800/50 rounded-lg transition-colors group"
  >
    <Avatar
      src={user.profilePicture || user.avatar}
      name={`${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`}
      size="sm"
      isOnline={isOnline}
    />
    <div className="flex-1 min-w-0 text-left">
      <span className={`text-sm truncate block ${isOnline ? 'text-zinc-300 group-hover:text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
        {user.firstName || user.first_name} {user.lastName || user.last_name}
      </span>
      {/* Show last seen for offline users */}
      {!isOnline && user.lastSeenDisplay && (
        <span className="text-[10px] text-zinc-600 block">
          {user.lastSeenDisplay}
        </span>
      )}
    </div>
  </button>
);

// Section Header
const SectionHeader = ({ title, count, isExpanded, onToggle, icon: Icon }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-zinc-800/30 rounded-lg transition-colors"
  >
    <div className="flex items-center gap-2">
      {Icon && <Icon size={14} className="text-zinc-500" />}
      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
        {title}
      </span>
      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
        count > 0 ? 'bg-amber-500/20 text-amber-500' : 'bg-zinc-800 text-zinc-600'
      }`}>
        {count}
      </span>
    </div>
    {isExpanded 
      ? <ChevronDown size={14} className="text-zinc-500" /> 
      : <ChevronRight size={14} className="text-zinc-500" />
    }
  </button>
);

const OnlineContactsSidebar = ({ 
  friends = [],
  allUsers = [], // Optional: all users if different from friends
  onlineUsers = [], // Array of online user IDs
  onOpenChat, 
  onNewMessage,
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({ 
    online: true, 
    all: true 
  });

  // Use allUsers if provided, otherwise use friends
  const contactList = allUsers.length > 0 ? allUsers : friends;

  // Filter by search
  const filterBySearch = (users) => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter((u) => {
      const name = `${u.firstName || u.first_name || ''} ${u.lastName || u.last_name || ''}`.toLowerCase();
      return name.includes(term);
    });
  };

  // Separate online and offline
  const onlineFriends = filterBySearch(
    contactList.filter(u => onlineUsers.includes(u.id) || onlineUsers.includes(String(u.id)))
  );
  
  const allContacts = filterBySearch(contactList);

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
              onClick={onNewMessage}
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
              title="New message"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
          <input
            type="text"
            placeholder="Search contacts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-800/50 rounded-full text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {/* ONLINE Section */}
        <div className="p-2">
          <SectionHeader
            title="Online"
            count={onlineFriends.length}
            isExpanded={expandedSections.online}
            onToggle={() => toggleSection('online')}
            icon={Circle}
          />

          {expandedSections.online && (
            <div className="mt-1 space-y-0.5">
              {onlineFriends.length === 0 ? (
                <p className="text-xs text-zinc-600 px-2 py-2">No contacts online</p>
              ) : (
                onlineFriends.map((user) => (
                  <ContactItem
                    key={user.id}
                    user={user}
                    isOnline={true}
                    onClick={onOpenChat}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* ALL USERS Section */}
        <div className="p-2 border-t border-zinc-800/30">
          <SectionHeader
            title="All Contacts"
            count={allContacts.length}
            isExpanded={expandedSections.all}
            onToggle={() => toggleSection('all')}
            icon={Users}
          />

          {expandedSections.all && (
            <div className="mt-1 space-y-0.5">
              {allContacts.length === 0 ? (
                <p className="text-xs text-zinc-600 px-2 py-2">No contacts</p>
              ) : (
                allContacts.map((user) => {
                  const isOnline = onlineUsers.includes(user.id) || onlineUsers.includes(String(user.id));
                  return (
                    <ContactItem
                      key={user.id}
                      user={user}
                      isOnline={isOnline}
                      onClick={onOpenChat}
                    />
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-zinc-800/50 text-center">
        <span className="text-[10px] text-zinc-600">
          {onlineFriends.length} online • {allContacts.length} total
        </span>
      </div>
    </div>
  );
};

export default OnlineContactsSidebar;