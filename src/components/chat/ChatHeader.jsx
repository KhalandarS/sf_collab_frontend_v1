import React from 'react';
import { Phone, Video, Info } from 'lucide-react';
import Avatar from './Avatar';

const ChatHeader = ({ 
  conversation, 
  currentUserId,
  isOnline = false,
  onVideoCall,
  onVoiceCall,
  onInfo
}) => {
  if (!conversation) return null;

  // Get other participant for direct messages
  const otherParticipant = conversation.conversation_type === 'direct'
    ? conversation.participants?.find(p => p.id !== currentUserId)
    : null;

  // Display name
  const displayName = conversation.name || 
    (otherParticipant 
      ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
      : 'Unknown'
    );

  // Avatar
  const avatarUrl = otherParticipant?.profilePicture || conversation.avatar_url;

  // Status text
  const getStatusText = () => {
    if (conversation.conversation_type === 'group') {
      return `${conversation.participants?.length || 0} members`;
    }
    if (conversation.conversation_type === 'general') {
      return `${conversation.participants?.length || 0} community members`;
    }
    if (conversation.conversation_type === 'team') {
      return `${conversation.participants?.length || 0} team members`;
    }
    // Direct message
    return isOnline ? 'Active now' : 'Offline';
  };

  return (
    <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50">
      {/* Left: User info */}
      <div className="flex items-center gap-3">
        <Avatar
          src={avatarUrl}
          name={displayName}
          size="md"
          isOnline={isOnline}
          showStatus={conversation.conversation_type === 'direct'}
        />
        <div>
          <h2 className="font-semibold text-white text-sm">
            {displayName}
          </h2>
          <p className={`text-xs ${isOnline && conversation.conversation_type === 'direct' ? 'text-emerald-500' : 'text-zinc-500'}`}>
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-1">
        {/* Voice call */}
        <button 
          onClick={onVoiceCall}
          className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
          title="Voice call"
        >
          <Phone size={18} />
        </button>
        
        {/* Video call */}
        <button 
          onClick={onVideoCall}
          className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
          title="Video call"
        >
          <Video size={18} />
        </button>
        
        {/* Info/Details */}
        <button 
          onClick={onInfo}
          className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
          title="Conversation info"
        >
          <Info size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;