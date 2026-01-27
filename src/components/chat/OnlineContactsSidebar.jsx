/**
 * OnlineContactsSidebar Component - Enhanced Version
 * Shows ONLY connected users (friends) with proper status indicators:
 * - Green = Online
 * - Red = Offline  
 * - Grey = Idle (inactive for 5+ minutes)
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, ChevronDown, ChevronRight, Users, Circle, UserCheck } from 'lucide-react';

// Status colors
const STATUS_COLORS = {
  online: 'bg-emerald-500',   // Green
  idle: 'bg-gray-400',        // Grey
  offline: 'bg-red-500',      // Red
};

// Avatar component with status indicator
const Avatar = ({ src, name, size = 'sm', status = 'offline', showStatus = true }) => {
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
        <span 
          className={`absolute -bottom-0.5 -right-0.5 ${statusSizes[size]} rounded-full border-zinc-900 ${STATUS_COLORS[status] || STATUS_COLORS.offline}`} 
        />
      )}
    </div>
  );
};

// Contact Item
const ContactItem = ({ user, status, statusText, onClick }) => (
  <button
    onClick={() => onClick(user)}
    className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-zinc-800/50 rounded-lg transition-colors group"
  >
    <Avatar
      src={user.profilePicture || user.profile_picture || user.avatar}
      name={`${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`}
      size="sm"
      status={status}
    />
    <div className="flex-1 min-w-0 text-left">
      <span className={`text-sm truncate block ${
        status === 'online' 
          ? 'text-zinc-200 group-hover:text-white' 
          : status === 'idle'
            ? 'text-zinc-400 group-hover:text-zinc-300'
            : 'text-zinc-500 group-hover:text-zinc-400'
      }`}>
        {user.firstName || user.first_name} {user.lastName || user.last_name}
      </span>
      {statusText && (
        <span className={`text-[10px] block ${
          status === 'online' ? 'text-emerald-500' : 
          status === 'idle' ? 'text-gray-400' : 'text-zinc-600'
        }`}>
          {statusText}
        </span>
      )}
    </div>
  </button>
);

// Section Header
const SectionHeader = ({ title, count, isExpanded, onToggle, icon: Icon, statusColor }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-zinc-800/30 rounded-lg transition-colors"
  >
    <div className="flex items-center gap-2">
      {Icon && <Icon size={14} className="text-zinc-500" />}
      {statusColor && <span className={`w-2 h-2 rounded-full ${statusColor}`} />}
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
  friends = [],           // Connected users (friends) - ONLY these will be shown
  onlineUsers = [],       // Array of online user IDs
  lastActiveAt = {},      // Map of userId -> last active timestamp (for idle detection)
  onOpenChat, 
  onNewMessage,
  token,               
  currentUserId,
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({ 
    online: true, 
    idle: true,
    offline: false 
  });

  // Normalize onlineUsers to Set of strings
  const onlineSet = useMemo(() => {
    if (Array.isArray(onlineUsers)) return new Set(onlineUsers.map(String));
    if (onlineUsers instanceof Set) return new Set([...onlineUsers].map(String));
    return new Set();
  }, [onlineUsers]);

  // Determine user status (online/idle/offline)
  const getUserStatus = (userId) => {
    const id = String(userId);
    const isConnected = onlineSet.has(id);
    
    if (!isConnected) return 'offline';
    
    // Check for idle (inactive for 5+ minutes)
    const lastActive = lastActiveAt?.[id];
    if (lastActive) {
      const diffMs = Date.now() - Number(lastActive);
      const IDLE_THRESHOLD = 5 * 60 * 1000; // 5 minutes
      if (diffMs > IDLE_THRESHOLD) return 'idle';
    }
    
    return 'online';
  };

  // Get status text
  const getStatusText = (status, userId) => {
    switch (status) {
      case 'online':
        return 'Active now';
      case 'idle':
        return 'Away';
      case 'offline':
        return 'Offline';
      default:
        return '';
    }
  };

  // Filter by search
  const filterBySearch = (users) => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter((u) => {
      const name = `${u.firstName || u.first_name || ''} ${u.lastName || u.last_name || ''}`.toLowerCase();
      const email = (u.email || '').toLowerCase();
      return name.includes(term) || email.includes(term);
    });
  };

  // Categorize friends by status
  const categorizedFriends = useMemo(() => {
    const filtered = filterBySearch(friends);
    
    const online = [];
    const idle = [];
    const offline = [];
    
    filtered.forEach((user) => {
      const status = getUserStatus(user.id);
      switch (status) {
        case 'online':
          online.push({ ...user, status, statusText: getStatusText(status, user.id) });
          break;
        case 'idle':
          idle.push({ ...user, status, statusText: getStatusText(status, user.id) });
          break;
        default:
          offline.push({ ...user, status, statusText: getStatusText(status, user.id) });
      }
    });
    
    return { online, idle, offline };
  }, [friends, searchTerm, onlineSet, lastActiveAt]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const totalOnline = categorizedFriends.online.length;
  const totalIdle = categorizedFriends.idle.length;
  const totalOffline = categorizedFriends.offline.length;
  const totalConnections = friends.length;

  return (
    <div className={`w-60 bg-zinc-950 border-l border-zinc-800 flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-3 border-b border-zinc-800/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <UserCheck size={16} className="text-amber-500" />
            <h3 className="font-semibold text-zinc-200 text-sm">Connections</h3>
          </div>
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
            placeholder="Search connections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-800/50 rounded-full text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {/* ONLINE Section (Green) */}
        <div className="p-2">
          <SectionHeader
            title="Online"
            count={totalOnline}
            isExpanded={expandedSections.online}
            onToggle={() => toggleSection('online')}
            statusColor={STATUS_COLORS.online}
          />

          {expandedSections.online && (
            <div className="mt-1 space-y-0.5">
              {totalOnline === 0 ? (
                <p className="text-xs text-zinc-600 px-2 py-2">No connections online</p>
              ) : (
                categorizedFriends.online.map((user) => (
                  <ContactItem
                    key={user.id}
                    user={user}
                    status="online"
                    statusText={user.statusText}
                    onClick={onOpenChat}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* IDLE Section (Grey) */}
        {totalIdle > 0 && (
          <div className="p-2 border-t border-zinc-800/30">
            <SectionHeader
              title="Away"
              count={totalIdle}
              isExpanded={expandedSections.idle}
              onToggle={() => toggleSection('idle')}
              statusColor={STATUS_COLORS.idle}
            />

            {expandedSections.idle && (
              <div className="mt-1 space-y-0.5">
                {categorizedFriends.idle.map((user) => (
                  <ContactItem
                    key={user.id}
                    user={user}
                    status="idle"
                    statusText={user.statusText}
                    onClick={onOpenChat}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* OFFLINE Section (Red) */}
        <div className="p-2 border-t border-zinc-800/30">
          <SectionHeader
            title="Offline"
            count={totalOffline}
            isExpanded={expandedSections.offline}
            onToggle={() => toggleSection('offline')}
            statusColor={STATUS_COLORS.offline}
          />

          {expandedSections.offline && (
            <div className="mt-1 space-y-0.5">
              {totalOffline === 0 ? (
                <p className="text-xs text-zinc-600 px-2 py-2">All connections are online!</p>
              ) : (
                categorizedFriends.offline.map((user) => (
                  <ContactItem
                    key={user.id}
                    user={user}
                    status="offline"
                    statusText={user.statusText}
                    onClick={onOpenChat}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer with status legend */}
      <div className="p-3 border-t border-zinc-800/50">
        <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500">
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${STATUS_COLORS.online}`} />
            <span>{totalOnline}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${STATUS_COLORS.idle}`} />
            <span>{totalIdle}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${STATUS_COLORS.offline}`} />
            <span>{totalOffline}</span>
          </div>
        </div>
        <div className="text-center mt-1">
          <span className="text-[10px] text-zinc-600">
            {totalConnections} connection{totalConnections !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OnlineContactsSidebar;