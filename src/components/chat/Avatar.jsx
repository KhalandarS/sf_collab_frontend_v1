/**
 * Avatar Component
 * Displays user avatar with online status indicator
 * 
 * Put this in: src/components/chat/Avatar.jsx
 * 
 * Usage:
 * <Avatar 
 *   src={user.profilePicture} 
 *   name="John Doe" 
 *   size="md" 
 *   isOnline={true} 
 * />
 */

import React from 'react';

const Avatar = ({ 
  src, 
  name, 
  size = 'md', 
  isOnline = false, 
  showStatus = true,
  className = '' 
}) => {
  // Size configurations
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-14 h-14 text-lg'
  };

  // Online status dot sizes
  const statusSizes = {
    xs: 'w-2 h-2 border',
    sm: 'w-2.5 h-2.5 border-[1.5px]',
    md: 'w-3 h-3 border-2',
    lg: 'w-3.5 h-3.5 border-2',
    xl: 'w-4 h-4 border-2'
  };

  // Generate initials from name
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      {/* Avatar image or initials */}
      {src ? (
        <img 
          src={src} 
          alt={name} 
          className={`${sizes[size]} rounded-full object-cover`} 
        />
      ) : (
        <div 
          className={`${sizes[size]} rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-semibold text-white`}
        >
          {initials}
        </div>
      )}
      
      {/* Online status dot */}
      {showStatus && (
        <span 
          className={`
            absolute -bottom-0.5 -right-0.5 
            ${statusSizes[size]} 
            rounded-full 
            border-zinc-900 
            ${isOnline ? 'bg-emerald-500' : 'bg-zinc-600'}
          `} 
        />
      )}
    </div>
  );
};

export default Avatar;