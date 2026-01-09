import React from 'react';
import Avatar from './Avatar';

const MessageBubble = ({ 
  message, 
  isOwn, 
  showAvatar,
  currentUserId 
}) => {
  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // System message (joins, leaves, etc.)
  if (message.message_type === 'system') {
    return (
      <div className="flex justify-center my-3">
        <div className="px-3 py-1.5 bg-zinc-800/50 rounded-full text-zinc-500 text-xs">
          {message.content || message.original_content}
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex gap-2 px-4 py-0.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar (only shown for first message in a group) */}
      <div className={`flex-shrink-0 w-8 ${showAvatar ? 'visible' : 'invisible'}`}>
        {showAvatar && (
          <Avatar
            src={message.sender?.profilePicture}
            name={`${message.sender?.firstName || ''}`}
            size="sm"
            showStatus={false}
          />
        )}
      </div>

      {/* Message content */}
      <div className={`flex flex-col max-w-[65%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Message bubble */}
        <div 
          className={`px-3 py-2 rounded-2xl text-sm ${
            isOwn
              ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white'
              : 'bg-zinc-800 text-zinc-100'
          }`}
        >
          {/* File attachment (if any) */}
          {message.file_url && (
            <div className="mb-2">
              {message.is_image ? (
                <img 
                  src={message.file_url} 
                  alt={message.file_name} 
                  className="max-w-full rounded-lg max-h-48 object-cover" 
                />
              ) : (
                <a 
                  href={message.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-black/20 rounded-lg hover:bg-black/30"
                >
                  <span className="text-sm truncate">{message.file_name}</span>
                </a>
              )}
            </div>
          )}
          
          {/* Message text */}
          {message.content || message.original_content}
          
          {/* Edited indicator */}
          {message.is_edited && (
            <span className="text-xs opacity-60 ml-1">(edited)</span>
          )}
        </div>
        
        {/* Timestamp (shows on hover) */}
        <span className="text-[10px] text-zinc-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {formatTime(message.created_at)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;