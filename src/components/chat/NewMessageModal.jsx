/**
 * NewMessageModal Component - Enhanced Version
 * 
 * Features:
 * - Search for ANY user to start a direct message (not just friends)
 * - Create group chats with multiple users
 * - Shows online status with proper colors (green/grey/red)
 * - API search integration for finding users
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Check, Search, Users, MessageCircle, Loader2 } from 'lucide-react';
import Avatar from './Avatar';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Status colors
const STATUS_COLORS = {
  online: 'bg-emerald-500',
  idle: 'bg-gray-400',
  offline: 'bg-red-500',
};

// Simple Avatar for this modal
const UserAvatar = ({ src, name, size = 'md', status = 'offline' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
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
      <span 
        className={`absolute -bottom-0.5 -right-0.5 ${statusSizes[size]} rounded-full border-2 border-zinc-900 ${STATUS_COLORS[status]}`} 
      />
    </div>
  );
};

const NewMessageModal = ({ 
  isOpen, 
  onClose, 
  friends = [],
  onlineUsers = [], 
  lastActiveAt = {},
  onSelectUser, 
  onCreateGroup,
  token,
  currentUserId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Normalize onlineUsers
  const onlineSet = React.useMemo(() => {
    return new Set((onlineUsers || []).map(String));
  }, [onlineUsers]);

  // Get user status
  const getUserStatus = (userId) => {
    const id = String(userId);
    const isConnected = onlineSet.has(id);
    
    if (!isConnected) return 'offline';
    
    const lastActive = lastActiveAt?.[id];
    if (lastActive) {
      const diffMs = Date.now() - Number(lastActive);
      if (diffMs > 5 * 60 * 1000) return 'idle';
    }
    
    return 'online';
  };

  // Search users API
  const searchUsers = useCallback(async (query) => {
    if (!query || query.length < 2 || !token) {
      setSearchResults([]);
      setShowSuggestions(true);
      return;
    }

    setIsSearching(true);
    setShowSuggestions(false);

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}&limit=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        // Filter out current user
        const users = (data.data?.users || data.users || [])
          .filter((u) => String(u.id) !== String(currentUserId));
        setSearchResults(users);
      } else {
        // Fallback: search in all users endpoint
        const fallbackRes = await fetch(
          `${API_BASE_URL}/users?search=${encodeURIComponent(query)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const fallbackData = await fallbackRes.json();
        const users = (fallbackData.data?.users || fallbackData.users || [])
          .filter((u) => String(u.id) !== String(currentUserId));
        setSearchResults(users);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [token, currentUserId]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        searchUsers(searchTerm);
      }, 300);
    } else {
      setSearchResults([]);
      setShowSuggestions(true);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, searchUsers]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setSearchTerm('');
      setSelectedUsers([]);
      setIsGroupMode(false);
      setGroupName('');
      setSearchResults([]);
      setShowSuggestions(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Get display list (search results or friends)
  const displayList = searchTerm.length >= 2 
    ? searchResults 
    : friends;

  // Sort: online first, then idle, then offline
  const sortedUsers = [...displayList].sort((a, b) => {
    const statusOrder = { online: 0, idle: 1, offline: 2 };
    const aStatus = getUserStatus(a.id);
    const bStatus = getUserStatus(b.id);
    return statusOrder[aStatus] - statusOrder[bStatus];
  });

  // Handle user click
  const handleUserClick = (user) => {
    if (isGroupMode) {
      setSelectedUsers((prev) =>
        prev.find((u) => u.id === user.id)
          ? prev.filter((u) => u.id !== user.id)
          : [...prev, user]
      );
    } else {
      onSelectUser(user);
      onClose();
    }
  };

  // Handle create group
  const handleCreateGroup = () => {
    if (selectedUsers.length > 0 && groupName.trim()) {
      onCreateGroup(selectedUsers.map((u) => u.id), groupName);
      onClose();
    }
  };

  // Remove selected user
  const removeSelectedUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <h2 className="text-base font-semibold text-white">New message</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex px-2 py-2 border-b border-zinc-800 gap-1">
          <button
            onClick={() => { 
              setIsGroupMode(false); 
              setSelectedUsers([]); 
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
              !isGroupMode 
                ? 'text-amber-500 bg-amber-500/10' 
                : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <MessageCircle size={16} />
            Direct Message
          </button>
          <button
            onClick={() => setIsGroupMode(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
              isGroupMode 
                ? 'text-amber-500 bg-amber-500/10' 
                : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Users size={16} />
            Create Group
          </button>
        </div>

        {/* Search Field */}
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-sm">To:</span>
            
            {/* Selected users chips (group mode) */}
            {selectedUsers.length > 0 && isGroupMode && (
              <div className="flex flex-wrap gap-1 flex-1">
                {selectedUsers.map((user) => (
                  <span 
                    key={user.id} 
                    className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs"
                  >
                    {user.firstName || user.first_name}
                    <button 
                      onClick={() => removeSelectedUser(user.id)} 
                      className="hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Search input */}
            {(!isGroupMode || selectedUsers.length === 0) && (
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-white text-sm placeholder-zinc-500 focus:outline-none"
                />
              </div>
            )}
            
            {isSearching && (
              <Loader2 size={16} className="text-amber-500 animate-spin" />
            )}
          </div>
          
          {/* Search hint */}
          {searchTerm.length > 0 && searchTerm.length < 2 && (
            <p className="text-xs text-zinc-500 mt-2">Type at least 2 characters to search</p>
          )}
        </div>

        {/* Group Name Input (only in group mode with selections) */}
        {isGroupMode && selectedUsers.length > 0 && (
          <div className="px-4 py-3 border-b border-zinc-800">
            <input
              type="text"
              placeholder="Group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-zinc-800 px-3 py-2 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        )}

        {/* Suggestions Header */}
        {showSuggestions && !searchTerm && (
          <div className="px-4 py-2 bg-zinc-800/30">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Your Connections
            </span>
          </div>
        )}

        {/* Search Results Header */}
        {searchTerm.length >= 2 && !isSearching && (
          <div className="px-4 py-2 bg-zinc-800/30">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              {searchResults.length > 0 
                ? `Found ${searchResults.length} user${searchResults.length !== 1 ? 's' : ''}`
                : 'No users found'}
            </span>
          </div>
        )}

        {/* User List */}
        <div className="max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="text-amber-500 animate-spin" />
            </div>
          ) : sortedUsers.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              {searchTerm.length >= 2 
                ? 'No users found. Try a different search.' 
                : 'No connections yet'}
            </div>
          ) : (
            sortedUsers.map((user) => {
              const status = getUserStatus(user.id);
              const isSelected = selectedUsers.find((u) => u.id === user.id);
              const userName = `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim();
              const profilePic = user.profilePicture || user.profile_picture || user.avatar;

              return (
                <button
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800/50 transition-colors ${
                    isSelected ? 'bg-amber-500/10' : ''
                  }`}
                >
                  <UserAvatar
                    src={profilePic}
                    name={userName}
                    size="md"
                    status={status}
                  />
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-white text-sm truncate">
                      {userName || 'Unknown User'}
                    </p>
                    <p className={`text-xs ${
                      status === 'online' ? 'text-emerald-500' :
                      status === 'idle' ? 'text-gray-400' :
                      'text-zinc-500'
                    }`}>
                      {status === 'online' ? 'Active now' :
                       status === 'idle' ? 'Away' :
                       'Offline'}
                    </p>
                  </div>
                  {isGroupMode && isSelected && (
                    <Check size={18} className="text-amber-500 flex-shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Create Group Button */}
        {isGroupMode && selectedUsers.length > 0 && (
          <div className="p-4 border-t border-zinc-800">
            <button
              onClick={handleCreateGroup}
              disabled={!groupName.trim()}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-semibold rounded-xl transition-colors"
            >
              Create Group ({selectedUsers.length} member{selectedUsers.length !== 1 ? 's' : ''})
            </button>
          </div>
        )}

        {/* Status Legend */}
        <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500">
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${STATUS_COLORS.online}`} />
              <span>Online</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${STATUS_COLORS.idle}`} />
              <span>Away</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${STATUS_COLORS.offline}`} />
              <span>Offline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;