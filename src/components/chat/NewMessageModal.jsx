/**
 * NewMessageModal Component
 * Modal for starting a new conversation (Facebook "New message" style)
 * 
 * Put this in: src/components/chat/NewMessageModal.jsx
 * 
 * Usage:
 * <NewMessageModal 
 *   isOpen={showNewMessage}
 *   onClose={() => setShowNewMessage(false)}
 *   friends={friends}
 *   onlineUsers={onlineUsers}
 *   onSelectUser={handleOpenChatWithFriend}
 *   onCreateGroup={handleCreateGroup}
 * />
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import Avatar from './Avatar';

const NewMessageModal = ({ 
  isOpen, 
  onClose, 
  friends, 
  onlineUsers, 
  onSelectUser, 
  onCreateGroup 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [groupName, setGroupName] = useState('');
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    // Reset state when modal closes
    if (!isOpen) {
      setSearchTerm('');
      setSelectedUsers([]);
      setIsGroupMode(false);
      setGroupName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter and sort friends
  const filteredFriends = friends.filter((f) => {
    if (!searchTerm) return true;
    const name = `${f.firstName} ${f.lastName}`.toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  // Sort: online users first
  const sortedFriends = [...filteredFriends].sort((a, b) => {
    const aOnline = onlineUsers.includes(a.id);
    const bOnline = onlineUsers.includes(b.id);
    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;
    return 0;
  });

  // Handle user click
  const handleUserClick = (user) => {
    if (isGroupMode) {
      // Toggle selection in group mode
      setSelectedUsers((prev) =>
        prev.find((u) => u.id === user.id)
          ? prev.filter((u) => u.id !== user.id)
          : [...prev, user]
      );
    } else {
      // Direct message - select user and close
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

        {/* To: Field */}
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-sm">To:</span>
            
            {/* Selected users (group mode) or search input */}
            {selectedUsers.length > 0 && isGroupMode ? (
              <div className="flex flex-wrap gap-1 flex-1">
                {selectedUsers.map((user) => (
                  <span 
                    key={user.id} 
                    className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full text-xs"
                  >
                    {user.firstName}
                    <button 
                      onClick={() => handleUserClick(user)} 
                      className="hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm placeholder-zinc-500 focus:outline-none"
              />
            )}
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex px-2 py-2 border-b border-zinc-800">
          <button
            onClick={() => { 
              setIsGroupMode(false); 
              setSelectedUsers([]); 
            }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              !isGroupMode 
                ? 'text-indigo-500 bg-indigo-500/10' 
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Direct Message
          </button>
          <button
            onClick={() => setIsGroupMode(true)}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              isGroupMode 
                ? 'text-indigo-500 bg-indigo-500/10' 
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Create Group
          </button>
        </div>

        {/* Group Name Input (only in group mode) */}
        {isGroupMode && (
          <div className="px-4 py-3 border-b border-zinc-800">
            <input
              type="text"
              placeholder="Group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-zinc-800 px-3 py-2 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Contact List */}
        <div className="max-h-80 overflow-y-auto">
          {sortedFriends.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              No contacts found
            </div>
          ) : (
            sortedFriends.map((friend) => {
              const isOnline = onlineUsers.includes(friend.id);
              const isSelected = selectedUsers.find((u) => u.id === friend.id);

              return (
                <button
                  key={friend.id}
                  onClick={() => handleUserClick(friend)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800/50 transition-colors ${
                    isSelected ? 'bg-indigo-500/10' : ''
                  }`}
                >
                  <Avatar
                    src={friend.profilePicture}
                    name={`${friend.firstName} ${friend.lastName}`}
                    size="md"
                    isOnline={isOnline}
                  />
                  <div className="flex-1 text-left">
                    <p className="font-medium text-white text-sm">
                      {friend.firstName} {friend.lastName}
                    </p>
                    {isOnline && (
                      <p className="text-xs text-emerald-500">Active now</p>
                    )}
                  </div>
                  {isGroupMode && isSelected && (
                    <Check size={18} className="text-indigo-500" />
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
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-semibold rounded-xl transition-colors"
            >
              Create Group ({selectedUsers.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewMessageModal;