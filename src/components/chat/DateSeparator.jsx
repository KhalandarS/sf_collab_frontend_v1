import React from 'react';

const DateSeparator = ({ date }) => {
  const formatDateLabel = (dateString) => {
    if (!dateString) return '';
    
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset time parts for comparison
    const messageDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    
    if (messageDateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    }
    
    if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    }
    
    // Check if within last 7 days - show day name
    const diffDays = Math.floor((todayOnly - messageDateOnly) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return messageDate.toLocaleDateString('en-US', { weekday: 'long' });
    }
    
    // Otherwise show full date
    return messageDate.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="flex items-center justify-center my-4">
      <div className="px-4 py-1.5 bg-zinc-800/80 rounded-full text-zinc-400 text-xs font-medium shadow-sm">
        {formatDateLabel(date)}
      </div>
    </div>
  );
};

/**
 * Helper function to determine if we should show a date separator
 * Call this before rendering each message
 */
export const shouldShowDateSeparator = (currentMessage, previousMessage) => {
  if (!previousMessage) return true; // First message always shows date
  
  const currentDate = new Date(currentMessage.created_at);
  const prevDate = new Date(previousMessage.created_at);
  
  // Compare dates (ignoring time)
  return (
    currentDate.getDate() !== prevDate.getDate() ||
    currentDate.getMonth() !== prevDate.getMonth() ||
    currentDate.getFullYear() !== prevDate.getFullYear()
  );
};

/**
 * Helper function to determine if we should show avatar/name
 * (Group consecutive messages from same sender)
 */
export const shouldShowSenderInfo = (currentMessage, previousMessage) => {
  if (!previousMessage) return true;
  
  // Different sender = show info
  if (currentMessage.sender_id !== previousMessage.sender_id) return true;
  
  // More than 5 minutes apart = show info
  const currentTime = new Date(currentMessage.created_at);
  const prevTime = new Date(previousMessage.created_at);
  const diffMinutes = (currentTime - prevTime) / (1000 * 60);
  
  return diffMinutes > 5;
};

export default DateSeparator;