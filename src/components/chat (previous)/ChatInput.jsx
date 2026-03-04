/**
 * ChatInput.jsx - FIXED VERSION
 * 
 * FIXES:
 * 1. Works with ChatPage props (value, onChange, onSend)
 * 2. REMOVED Plus button
 * 3. Emoji picker works
 * 4. File/Image upload works
 * 5. AUTO-EXPANDING TEXTAREA (NEW)
 * 6. CTRL+V PASTE SUPPORT FOR IMAGES (NEW)
 */

import React, { useState, useRef, useCallback } from 'react';
import { Send, Smile, Paperclip, Image as ImageIcon, X, Loader2 } from 'lucide-react';

// Simple emoji list
const EMOJI_LIST = [
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
];

// File preview component
const FilePreview = ({ file, onRemove }) => {
  const isImage = file?.type?.startsWith('image/');
  const [preview, setPreview] = useState(null);

  React.useEffect(() => {
    if (isImage && file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  }, [file, isImage]);

  if (!file) return null;

  return (
    <div className="relative inline-block">
      {isImage && preview ? (
        <img loading="lazy" 
          src={preview} 
          alt={file.name} 
          className="h-16 w-16 object-cover rounded-lg border border-zinc-700"
        />
      ) : (
        <div className="h-16 px-3 flex items-center gap-2 bg-zinc-800 rounded-lg border border-zinc-700">
          <Paperclip size={16} className="text-zinc-400" />
          <span className="text-xs text-zinc-300 max-w-25 truncate">{file.name}</span>
        </div>
      )}
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
      >
        <X size={12} />
      </button>
    </div>
  );
};

// Emoji Picker component
const EmojiPicker = ({ isOpen, onSelect, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-full right-0 mb-2 p-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-50 w-72">
        <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
          {EMOJI_LIST.map((emoji, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                onSelect(emoji);
                onClose();
              }}
              className="p-2 hover:bg-zinc-800 rounded-lg text-xl transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

const ChatInput = ({ 
  value = '',           // Controlled value from parent
  onChange,             // Callback when text changes
  onSend,               // Callback to send message
  onFileUpload,         // Optional: function to upload file and get URL
  socket,               // Optional: socket for file events
  conversationId,       // Optional: for file uploads
  disabled = false,
  placeholder = "Type a message..."
}) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Handle text input change
  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  // Auto-resize textarea
  const handleTextareaResize = useCallback((e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }, []);

  // Handle send
  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (isUploading || disabled) return;
    
    // Handle file upload first
    if (selectedFile) {
      await handleFileSend();
      return;
    }
    
    // Handle text message
    if (value?.trim()) {
      onSend(value.trim());
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = '40px';
      }
      inputRef.current?.focus();
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
    e.target.value = '';
  };

  // Handle paste for images (Ctrl+V screenshots) - NEW!
  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          if (file.size > 10 * 1024 * 1024) {
            alert('Image size must be less than 10MB');
            return;
          }
          setSelectedFile(file);
        }
        return;
      }
    }
  }, []);

  // Send file
  const handleFileSend = async () => {
    if (!selectedFile) return;

    // If we have an onFileUpload function, use it
    if (onFileUpload) {
      setIsUploading(true);
      
      try {
        const fileUrl = await onFileUpload(selectedFile);
        
        if (fileUrl && socket && conversationId) {
          socket.emit('send_file', {
            conversation_id: conversationId,
            file_url: fileUrl,
            file_name: selectedFile.name,
            file_type: selectedFile.type.startsWith('image/') ? 'image' : 'file'
          });
        }
        
        setSelectedFile(null);
      } catch (error) {
        console.error('Failed to upload file:', error);
        alert('Failed to upload file. Please try again.');
      } finally {
        setIsUploading(false);
      }
    } else {
      // No upload function - just send file name as message (fallback)
      onSend(`[File: ${selectedFile.name}]`);
      setSelectedFile(null);
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    if (onChange) {
      onChange((value || '') + emoji);
    }
    inputRef.current?.focus();
  };

  // Handle like/thumbs up
  const handleLike = () => {
    onSend('');
  };

  // Handle Enter key (send on Enter, new line on Shift+Enter)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-900/50">
      {/* File Preview */}
      {selectedFile && (
        <div className="px-3 md:px-4 pt-2 md:pt-3">
          <FilePreview 
            file={selectedFile} 
            onRemove={() => setSelectedFile(null)} 
          />
        </div>
      )}

      {/* Input Area */}
      <div className="p-2 md:p-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-1.5 md:gap-2">
          {/* Image button */}
          <button 
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="p-1.5 md:p-2 hover:bg-zinc-800 rounded-full text-indigo-400 hover:text-indigo-300 transition-colors shrink-0 mb-1"
            disabled={disabled || isUploading}
            title="Send image"
          >
            <ImageIcon size={18} className="md:w-5 md:h-5" />
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* File button */}
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 md:p-2 hover:bg-zinc-800 rounded-full text-indigo-400 hover:text-indigo-300 transition-colors shrink-0 mb-1"
            disabled={disabled || isUploading}
            title="Attach file"
          >
            <Paperclip size={18} className="md:w-5 md:h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx,.zip,.rar,.png,.jpg,.jpeg,.gif"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Text input - AUTO-EXPANDING TEXTAREA */}
          <div className="flex-1 relative min-w-0">
            <textarea
              ref={inputRef}
              value={value || ''}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onInput={handleTextareaResize}
              placeholder={placeholder}
              disabled={disabled || isUploading}
              rows={1}
              className="w-full px-3 md:px-4 py-2 md:py-2.5 pr-12 md:pr-14 bg-zinc-800 rounded-2xl text-xs md:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-all resize-none overflow-y-auto"
              style={{
                minHeight: '40px',
                maxHeight: '120px',
              }}
            />
            
            {/* Emoji button */}
            <div className="absolute right-1.5 md:right-2 bottom-1.5 md:bottom-2 shrink-0">
              <button 
                type="button"
                onClick={() => setShowEmoji(!showEmoji)}
                className="p-1 text-indigo-400 hover:text-indigo-300 rounded-full hover:bg-zinc-700/50 transition-colors"
                disabled={disabled}
              >
                <Smile size={18} className="md:w-5 md:h-5" />
              </button>
              
              <EmojiPicker 
                isOpen={showEmoji}
                onSelect={handleEmojiSelect}
                onClose={() => setShowEmoji(false)}
              />
            </div>
          </div>

          {/* Send or Like button */}
          {isUploading ? (
            <div className="p-1.5 md:p-2 text-indigo-400 shrink-0 mb-1">
              <Loader2 size={18} className="md:w-5 md:h-5 animate-spin" />
            </div>
          ) : (value?.trim() || selectedFile) ? (
            <button 
              type="submit" 
              className="p-1.5 md:p-2 text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50 shrink-0 hover:bg-zinc-700/50 rounded-full mb-1"
              disabled={disabled}
            >
              <Send size={18} className="md:w-5 md:h-5" />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleLike}
              className="p-1.5 md:p-2 text-lg md:text-xl hover:bg-zinc-700/50 rounded-full transition-colors shrink-0 disabled:opacity-50 mb-1"
              disabled={disabled}
            >
              
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatInput;