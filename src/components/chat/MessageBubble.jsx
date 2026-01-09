/**
 * MessageBubble.jsx - FIXED VERSION
 * 
 * FIXES:
 * 1. Own messages on RIGHT (indigo/blue gradient)
 * 2. Others' messages on LEFT (gray)
 * 3. Shows sender name for group/team/general chats
 * 4. Shows time for all messages
 * 5. Proper type comparison for sender_id (converts to string)
 */

import React from 'react';
import Avatar from './Avatar';

const MessageBubble = ({ 
  message, 
  isOwn,  // true = current user sent this
  showAvatar = true,
  currentUserId  // passed from parent for double-check
}) => {
  // Double-check isOwn with string comparison (in case types differ)
  const senderId = message?.sender_id ?? message?.sender?.id;
  const actuallyOwn = isOwn || String(senderId) === String(currentUserId);

  // Pick the correct timestamp field regardless of backend shape
  const ts =
    message?.created_at ??
    message?.createdAt ??
    message?.timestamp ??
    message?.sent_at ??
    message?.sentAt ??
    null;

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get sender name
  const senderName = message?.sender
    ? `${message.sender.firstName || message.sender.first_name || ''} ${message.sender.lastName || message.sender.last_name || ''}`.trim()
    : '';

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

  // Check if has file/image
  const hasImage = message.message_type === 'image' || 
    message.is_image ||
    (message.file_url && /\.(jpg|jpeg|png|gif|webp)$/i.test(message.file_url));
  
  const hasFile = message.file_url && !hasImage;

  return (
    <div className={`group flex gap-2 px-4 py-1 ${actuallyOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar - only show for OTHER people's messages */}
      {!actuallyOwn && (
        <div className={`flex-shrink-0 w-8 ${showAvatar ? 'visible' : 'invisible'}`}>
          {showAvatar && (
            <Avatar
              src={message.sender?.profilePicture || message.sender?.profile_picture}
              name={senderName || 'User'}
              size="sm"
              showStatus={false}
            />
          )}
        </div>
      )}

      <div className={`flex flex-col max-w-[70%] ${actuallyOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender name - ONLY show for OTHER people's messages, not your own */}
        {!actuallyOwn && showAvatar && senderName && (
          <span className="text-[11px] text-zinc-400 mb-0.5 ml-1">
            {senderName}
          </span>
        )}

        {/* Message bubble */}
        <div
          className={`px-3 py-2 rounded-2xl text-sm ${
            actuallyOwn
              ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-br-sm'
              : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
          }`}
        >
          {/* Image attachment */}
          {hasImage && message.file_url && (
            <div className="mb-2">
              <img
                src={message.file_url}
                alt={message.file_name || 'Image'}
                className="max-w-full rounded-lg max-h-48 object-cover cursor-pointer hover:opacity-90"
                onClick={() => window.open(message.file_url, '_blank')}
              />
            </div>
          )}

          {/* File attachment */}
          {hasFile && (
            <a
              href={message.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 p-2 rounded-lg mb-2 ${
                actuallyOwn ? 'bg-white/20 hover:bg-white/30' : 'bg-zinc-700 hover:bg-zinc-600'
              }`}
            >
              <span className="text-sm truncate">{message.file_name || 'File'}</span>
            </a>
          )}

          {/* Message text */}
          {(message.content || message.original_content) && (
            <span className="whitespace-pre-wrap break-words">
              {message.content || message.original_content}
            </span>
          )}

          {message.is_edited && (
            <span className="text-xs opacity-60 ml-1">(edited)</span>
          )}
        </div>

        {/* Time - always visible */}
        <span className="text-[10px] text-zinc-600 mt-0.5 px-1">
          {formatTime(ts)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;