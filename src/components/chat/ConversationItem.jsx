import React from 'react';
import Avatar from './Avatar';

const ConversationItem = ({ 
  conversation, 
  isActive, 
  onClick, 
  onlineUsers, 
  currentUserId 
}) => {
  // Determine conversation type
  const isGroup = conversation.conversation_type === 'group';
  const isGeneral = conversation.conversation_type === 'general';
  const isTeam = conversation.conversation_type === 'team';
  const isDirect = conversation.conversation_type === 'direct';

  // Get the other participant (for direct messages)
  const otherParticipant = isDirect
    ? conversation.participants?.find((p) => p.id !== currentUserId)
    : null;

  // Check if other user is online
  const isOnline = otherParticipant
    ? onlineUsers.includes(otherParticipant.id)
    : false;

  // Display name
  const displayName = isGroup || isGeneral || isTeam
    ? conversation.name
    : otherParticipant
      ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
      : 'Unknown';

  // Avatar URL
  const avatarUrl = otherParticipant?.profilePicture || conversation.avatar_url;

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-2.5 rounded-xl transition-all
        ${isActive ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'}
      `}
    >
      {/* Avatar */}
      <Avatar
        src={avatarUrl}
        name={displayName}
        size="md"
        isOnline={isOnline}
        showStatus={isDirect} // Only show status for direct messages
      />

      {/* Info */}
      <div className="flex-1 min-w-0 text-left">
        {/* Top row: Name + Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {/* Category badge */}
            {isGeneral && <span className="text-[10px]">🌐</span>}
            {isTeam && <span className="text-[10px]">🚀</span>}
            {isGroup && <span className="text-[10px]">👥</span>}
            <div className="font-medium text-sm truncate">{displayName}</div>
        </div>
          
          {/* Last message time */}
          {conversation.last_message && (
            <span className="text-[10px] text-zinc-600 flex-shrink-0 ml-2">
              {conversation.last_message.display_time?.relative || ''}
            </span>
          )}
        </div>
        
        {/* Bottom row: Last message + Unread count */}
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-zinc-500 truncate">
            {conversation.last_message?.content || 'No messages yet'}
          </p>
          
          {/* Unread badge */}
          {conversation.unread_count > 0 && (
            <span className="ml-2 w-5 h-5 flex items-center justify-center bg-indigo-500 text-zinc-900 text-[10px] font-bold rounded-full flex-shrink-0">
              {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;