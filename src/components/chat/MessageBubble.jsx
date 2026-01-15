import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Avatar from './Avatar';
import { getProfilePicture } from '@/utils/getProfilePicture';

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
      : message?.sender_name || message?.senderName || '';

  /* =========================
     SYSTEM MESSAGE
  ========================= */
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
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 ${showAvatar ? 'visible' : 'invisible'}`}>
        {showAvatar && (
          <Avatar
            src={getProfilePicture(message.sender?.profilePicture)}
            name={senderName || ' '}
            size="sm"
            showStatus={false}
          />
        )}
      </div>

      <div className={`flex flex-col max-w-[65%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender name */}
        {!isOwn && senderName && (
          <span className="text-[11px] text-zinc-400 mb-0.5">{senderName}</span>
        )}

        {/* Message bubble */}
        <div
          className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white'
              : 'bg-zinc-800 text-zinc-100'
          }`}
        >
          {/* File / Image */}
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

          {/* ✅ MARKDOWN CONTENT */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-4 space-y-1 my-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-4 space-y-1 my-1">{children}</ol>
              ),
              li: ({ children }) => <li>{children}</li>,
              code: ({ inline, children }) =>
                inline ? (
                  <code className="px-1 py-0.5 rounded bg-black/30 text-xs">
                    {children}
                  </code>
                ) : (
                  <pre className="mt-2 p-2 rounded bg-black/40 text-xs overflow-x-auto">
                    <code>{children}</code>
                  </pre>
                ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-indigo-300 hover:text-indigo-200"
                >
                  {children}
                </a>
              ),
            }}
          >
            {message.content || message.original_content || ''}
          </ReactMarkdown>

          {message.is_edited && (
            <span className="text-xs opacity-60 ml-1">(edited)</span>
          )}
        </div>

        {/* Time */}
        <span className="text-[10px] text-zinc-600 mt-0.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          {formatTime(ts)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
