import React, { useRef } from 'react';
import { Send, Smile, Paperclip, Image as ImageIcon, Plus } from 'lucide-react';

const ChatInput = ({ 
  value, 
  onChange, 
  onSend, 
  onFileSelect,
  disabled = false,
  placeholder = "Aa"
}) => {
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value.trim());
    }
  };

  // Handle file button click
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    // Reset input
    e.target.value = '';
  };

  // Handle like/thumbs up (when input is empty)
  const handleLike = () => {
    // You can customize this - send a 👍 message or trigger an emoji
    onSend('👍');
  };

  return (
    <div className="p-3 border-t border-zinc-800">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Plus button (for more options) */}
        <button 
          type="button" 
          className="p-2 hover:bg-zinc-800 rounded-full text-indigo-500 transition-colors"
          disabled={disabled}
        >
          <Plus size={20} />
        </button>
        
        {/* Image button */}
        <button 
          type="button" 
          onClick={handleFileClick}
          className="p-2 hover:bg-zinc-800 rounded-full text-indigo-500 transition-colors"
          disabled={disabled}
        >
          <ImageIcon size={20} />
        </button>
        
        {/* Attachment button */}
        <button 
          type="button" 
          onClick={handleFileClick}
          className="p-2 hover:bg-zinc-800 rounded-full text-indigo-500 transition-colors"
          disabled={disabled}
        >
          <Paperclip size={20} />
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />

        {/* Text input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-2.5 bg-zinc-800 rounded-full text-white placeholder-zinc-500 focus:outline-none disabled:opacity-50"
          />
          
          {/* Emoji button (inside input) */}
          <button 
            type="button" 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-400"
            disabled={disabled}
          >
            <Smile size={20} />
          </button>
        </div>

        {/* Send or Like button */}
        {value.trim() ? (
          <button 
            type="submit" 
            className="p-2 text-indigo-500 hover:text-indigo-400 transition-colors disabled:opacity-50"
            disabled={disabled}
          >
            <Send size={20} />
          </button>
        ) : (
          <button 
            type="button" 
            onClick={handleLike}
            className="p-2 text-indigo-500 hover:text-indigo-400 transition-colors text-xl disabled:opacity-50"
            disabled={disabled}
          >
            👍
          </button>
        )}
      </form>
    </div>
  );
};

export default ChatInput;