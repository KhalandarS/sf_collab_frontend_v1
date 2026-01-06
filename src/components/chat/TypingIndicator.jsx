/**
 * TypingIndicator Component
 * Shows animated dots when someone is typing
 * 
 * Put this in: src/components/chat/TypingIndicator.jsx
 * 
 * Usage:
 * <TypingIndicator users={[{ firstName: 'John' }]} />
 */

import React from 'react';

const TypingIndicator = ({ users }) => {
  if (!users?.length) return null;
  
  const names = users.map((u) => u.firstName).join(', ');
  
  return (
    <div className="flex items-center gap-3 px-4 py-2 text-zinc-500 text-sm">
      {/* Animated dots */}
      <div className="flex gap-1">
        <span 
          className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" 
          style={{ animationDelay: '0ms' }} 
        />
        <span 
          className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" 
          style={{ animationDelay: '150ms' }} 
        />
        <span 
          className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" 
          style={{ animationDelay: '300ms' }} 
        />
      </div>
      
      {/* Text */}
      <span>
        {names} {users.length === 1 ? 'is' : 'are'} typing...
      </span>
    </div>
  );
};

export default TypingIndicator;