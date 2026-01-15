/**
 * ChatInput.jsx - MULTI FILE SUPPORT
 *
 * FEATURES:
 * 1. Controlled input (value, onChange, onSend)
 * 2. Emoji picker
 * 3. Single OR multiple file upload (configurable)
 * 4. Image + file previews
 * 5. Sequential upload support
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Smile,
  Paperclip,
  Image as ImageIcon,
  X,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';

/* -------------------- Emoji List -------------------- */

const EMOJI_LIST = [
  '😀','😂','🥰','😍','🤩','😎','🙂','😊',
  '👍','👎','👏','🙌','🤝','✌️','🤞','💪',
  '❤️','🧡','💛','💚','💙','💜','🖤','💔',
  '🔥','⭐','✨','💯','🎉','🎊','🎁','🏆',
  '🙏','🤔','😢','😭','😠','🤬','😱','🙄',
];

/* -------------------- File Preview -------------------- */

const FilePreview = ({ file, onRemove }) => {
  const isImage = file.type?.startsWith('image/');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isImage) {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  }, [file, isImage]);

  return (
    <div className="relative inline-block mr-2 mb-2">
      {isImage && preview ? (
        <img
          src={preview}
          alt={file.name}
          className="h-16 w-16 object-cover rounded-lg border border-zinc-700"
        />
      ) : (
        <div className="h-16 px-3 flex items-center gap-2 bg-zinc-800 rounded-lg border border-zinc-700">
          <Paperclip size={16} className="text-zinc-400" />
          <span className="text-xs text-zinc-300 max-w-[100px] truncate">
            {file.name}
          </span>
        </div>
      )}

      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
      >
        <X size={12} />
      </button>
    </div>
  );
};

/* -------------------- Emoji Picker -------------------- */

const EmojiPicker = ({ isOpen, onSelect, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-full right-0 mb-2 p-2 bg-zinc-900 border border-zinc-700 rounded-xl z-50 w-72">
        <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
          {EMOJI_LIST.map((emoji, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onSelect(emoji);
                onClose();
              }}
              className="p-2 hover:bg-zinc-800 rounded-lg text-xl"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

/* -------------------- ChatInput -------------------- */

const ChatInput = ({
  value = '',
  onChange,
  onSend,
  onFileUpload,
  socket,
  conversationId,
  disabled = false,
  placeholder = 'Type a message...',
  allowEmojis = true,
  allowFiles = true,
  allowImages = true,
  acceptMultipleFiles = false,
}) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  /* -------------------- Handlers -------------------- */

  const handleInputChange = e => onChange?.(e.target.value);

  const handleFileSelect = e => {
    const selected = Array.from(e.target.files || []);

    const valid = selected.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB`);
        return false;
      }
      return true;
    });

    setFiles(prev =>
      acceptMultipleFiles ? [...prev, ...valid] : valid.slice(0, 1)
    );

    e.target.value = '';
  };

  const handleFileSend = async () => {
    if (!files.length || !onFileUpload) return;

    setIsUploading(true);

    try {
      for (const file of files) {
        const url = await onFileUpload(file);

        if (url && socket && conversationId) {
          socket.emit('send_file', {
            conversation_id: conversationId,
            file_url: url,
            file_name: file.name,
            file_type: file.type.startsWith('image/') ? 'image' : 'file',
          });
        }
      }

      setFiles([]);
    } catch (err) {
      console.error(err);
      toast.error('File upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (disabled || isUploading) return;

    if (files.length) {
      await handleFileSend();
      return;
    }

    if (value.trim()) {
      onSend(value.trim());
      inputRef.current?.focus();
    }
  };

  const handleEmojiSelect = emoji => {
    onChange?.((value || '') + emoji);
    inputRef.current?.focus();
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <div className="border-t border-zinc-800 bg-zinc-900/50">
      {files.length > 0 && (
        <div className="px-4 pt-3 flex flex-wrap">
          {files.map((file, i) => (
            <FilePreview
              key={i}
              file={file}
              onRemove={() =>
                setFiles(prev => prev.filter((_, idx) => idx !== i))
              }
            />
          ))}
        </div>
      )}

      <div className="p-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {allowImages && (
            <>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="p-2 text-indigo-400 hover:text-indigo-300"
                disabled={disabled}
              >
                <ImageIcon size={20} />
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple={acceptMultipleFiles}
                onChange={handleFileSelect}
                className="hidden"
              />
            </>
          )}

          {allowFiles && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-indigo-400 hover:text-indigo-300"
                disabled={disabled}
              >
                <Paperclip size={20} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple={acceptMultipleFiles}
                onChange={handleFileSelect}
                className="hidden"
              />
            </>
          )}

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isUploading}
              className="w-full px-4 py-2.5 bg-zinc-800 rounded-full text-white pr-10"
            />

            {allowEmojis && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => setShowEmoji(!showEmoji)}
                  className="text-indigo-400"
                >
                  <Smile size={20} />
                </button>
                <EmojiPicker
                  isOpen={showEmoji}
                  onSelect={handleEmojiSelect}
                  onClose={() => setShowEmoji(false)}
                />
              </div>
            )}
          </div>

          {isUploading ? (
            <Loader2 size={20} className="animate-spin text-indigo-400" />
          ) : (
            <button
              type="submit"
              className="p-2 text-indigo-400 hover:text-indigo-300"
            >
              <Send size={20} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
