import React from 'react';
import Avatar from './Avatar';

const MessageBubble = ({ message, isOwn, showAvatar }) => {
  // pick the correct timestamp field regardless of backend shape
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

  const senderName =
    message?.sender
      ? `${message.sender.firstName || ''} ${message.sender.lastName || ''}`.trim()
      : '';

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
      <div className={`flex-shrink-0 w-8 ${showAvatar ? 'visible' : 'invisible'}`}>
        {showAvatar && (
          <Avatar
            src={message.sender?.profilePicture}
            name={senderName || ' '}
            size="sm"
            showStatus={false}
          />
        )}
      </div>

      <div className={`flex flex-col max-w-[65%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* ✅ Sender name (only for other people's messages) */}
        {!isOwn && senderName && (
          <span className="text-[11px] text-zinc-400 mb-0.5">{senderName}</span>
        )}

        <div
          className={`px-3 py-2 rounded-2xl text-sm ${
            isOwn
              ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white'
              : 'bg-zinc-800 text-zinc-100'
          }`}
        >
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

          {message.content || message.original_content}

          {message.is_edited && (
            <span className="text-xs opacity-60 ml-1">(edited)</span>
          )}
        </div>

        {/* ✅ Time (show always on mobile, hover on desktop) */}
        <span className="text-[10px] text-zinc-600 mt-0.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          {formatTime(ts)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
