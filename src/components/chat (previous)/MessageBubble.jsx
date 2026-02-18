/**
 * MessageBubble Component - Fixed Version
 * 
 * FEATURES:
 * 1. Profile pictures display correctly
 * 2. Timestamps always visible
 * 3. Delete for everyone (within 1 hour) / Delete for me (anytime)
 * 4. No browser alerts - styled modals only
 * 5. Edit message functionality
 */

import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { X, Download, FileText, ExternalLink, Check, CheckCheck, Eye, MoreVertical, Edit2, Trash2 } from "lucide-react";
import Avatar from "./Avatar";
import { getProfilePicture } from "@/utils/getProfilePicture";
import { chatAPI } from "@/utils/APIs/chatApi";

// Helper to reduce text length
const reduceText = (text, maxLength = 20) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Files are typically served from the backend host
const FILE_BASE_URL =
  import.meta.env.VITE_SOCKET_API_URL ||
  (import.meta.env.VITE_API_URL
    ? String(import.meta.env.VITE_API_URL).replace(/\/api\/?$/, "")
    : "http://localhost:5001");

const resolveUrl = (url) => {
  if (!url) return null;
  const s = String(url);
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("blob:") || s.startsWith("data:")) return s;
  const slash = s.startsWith("/") ? "" : "/";
  return `${FILE_BASE_URL}${slash}${s}`;
};

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function fetchBlobWithAuth(url, token) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Download failed (${res.status})`);
  }

  return await res.blob();
}

async function forceDownload(url, filename, token) {
  try {
    const blob = await fetchBlobWithAuth(url, token);
    const a = document.createElement("a");
    const href = URL.createObjectURL(blob);
    a.href = href;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

async function openInNewTab(url, token) {
  try {
    const blob = await fetchBlobWithAuth(url, token);
    const href = URL.createObjectURL(blob);
    window.open(href, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(href), 60_000);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

function hideAutoFileText({ fileUrl, isImage, content, fileName }) {
  if (!fileUrl || !isImage) return false;
  const c = String(content || "").trim();
  if (!c) return false;
  if (/^\[\s*file\s*:/i.test(c)) return true;
  if (fileName && c === fileName) return true;
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(c)) return true;
  if (c === fileUrl) return true;
  return false;
}

function getMsgStatus(msg) {
  const s = String(msg?.status || msg?.delivery_status || "").toLowerCase();
  if (s === "read" || s === "seen" || msg?.read_at || msg?.seen_at) return "opened";
  if (s === "delivered" || msg?.delivered_at) return "delivered";
  return "sent";
}

export default function MessageBubble({ 
  message, 
  isOwn, 
  showAvatar, 
  showSenderName = false,
  setMessages = null,
  onMessageUpdated = null,
  conversationId = null,
  conversationType = "direct",
  variant = "page" // "page" or "dock"
}) {
  const navigate = useNavigate();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingEditing, setIsLoadingEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const menuRef = useRef(null);

  const { access_token: token } = useSelector((state) => state.auth || {});

  const ts =
    message?.created_at ??
    message?.createdAt ??
    message?.timestamp ??
    message?.sent_at ??
    message?.sentAt ??
    null;

  const senderName = useMemo(() => {
    if (message?.sender) {
      const firstName = message.sender.firstName || message.sender.first_name || "";
      const lastName = message.sender.lastName || message.sender.last_name || "";
      return `${firstName} ${lastName}`.trim();
    }
    return message?.sender_name || message?.senderName || "";
  }, [message]);

  const senderAvatar = useMemo(() => {
    return getProfilePicture(message?.sender);
  }, [message?.sender]);

  const fileUrl = message?.file_url ? resolveUrl(message.file_url) : null;

  const isImage =
    Boolean(message?.is_image) ||
    (message?.file_type && (String(message.file_type) === "image" || String(message.file_type).startsWith("image/"))) ||
    message?.message_type === "image";

  // Check if message can be deleted for everyone (within 1 hour)
  const canDeleteForEveryone = useMemo(() => {
    if (!ts) return true; // If no timestamp, allow it
    const messageTime = new Date(ts);
    const now = new Date();
    const diffHours = (now - messageTime) / (1000 * 60 * 60);
    return diffHours <= 1;
  }, [ts]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle edit
  const handleEditClick = useCallback(() => {
    const contentToEdit = message.content || message.original_content || "";
    setEditContent(contentToEdit);
    setIsEditing(true);
    setMenuOpen(false);
  }, [message.content, message.original_content]);

  const handleSaveEdit = useCallback(async () => {
    if (!editContent.trim() || !conversationId) return;

    try {
      setIsLoadingEditing(true);
      await chatAPI.editMessage(conversationId, message.id, editContent.trim());
      
      if (setMessages) {
        const updatedMessage = {
          ...message,
          original_content: editContent.trim(),
          content: editContent.trim(),
          is_edited: true,
        };
        
        setMessages((prev) =>
          prev.map((m) =>
            String(m.id) === String(message.id) ? updatedMessage : m
          )
        );
      }

      if (onMessageUpdated) {
        onMessageUpdated({
          ...message,
          original_content: editContent.trim(),
          content: editContent.trim(),
          is_edited: true,
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Edit failed:", error);
      setDeleteError("Failed to edit message");
    } finally {
      setIsLoadingEditing(false);
    }
  }, [editContent, conversationId, message, setMessages, onMessageUpdated]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditContent("");
  }, []);

  // Delete handler - supports delete for everyone or just me
  const handleDelete = useCallback(async (deleteType) => {
    if (!conversationId || !message.id) return;
    
    try {
      setDeleting(true);
      setDeleteError(null);
      
      await chatAPI.deleteMessage(conversationId, message.id, deleteType);
      
      if (setMessages) {
        if (deleteType === 'everyone') {
          // Mark as deleted for everyone - show "This message was deleted"
          setMessages((prev) =>
            prev.map((m) =>
              String(m.id) === String(message.id)
                ? { ...m, is_deleted: true, content: "This message was deleted" }
                : m
            )
          );
        } else {
          // Remove from local view only (delete for me)
          setMessages((prev) => prev.filter((m) => String(m.id) !== String(message.id)));
        }
      }
      
      setDeleteModalOpen(false);
      setMenuOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
      const errorMsg = error?.response?.data?.error || "Failed to delete message";
      setDeleteError(errorMsg);
    } finally {
      setDeleting(false);
    }
  }, [conversationId, message.id, setMessages]);

  const onDownload = useCallback(() => {
    if (!fileUrl) return;
    forceDownload(fileUrl, message?.file_name || "download", token);
  }, [fileUrl, message?.file_name, token]);

  const onOpen = useCallback(() => {
    if (!fileUrl) return;
    openInNewTab(fileUrl, token);
  }, [fileUrl, token]);

  // If message is deleted, show deleted placeholder
  if (message?.is_deleted) {
    return (
      <div className={`group flex gap-1 px-1 py-0.5 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}>
        <div className="w-8 shrink-0" />
        <div className={`flex flex-col max-w-[65%] ${isOwn ? "items-end" : "items-start"}`}>
          <div className={`px-3 py-2 rounded-2xl text-sm italic ${
            isOwn ? "bg-zinc-700/50 text-zinc-400" : "bg-zinc-800/50 text-zinc-500"
          }`}>
            This message was deleted
          </div>
          <span className="text-[10px] text-zinc-600 mt-1">{formatTime(ts)}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Image Viewer Overlay */}
      {viewerOpen && fileUrl && isImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={() => setViewerOpen(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              className="absolute top-4 left-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              title="Download"
            >
              <Download size={18} />
            </button>

            <button
              className="absolute top-4 left-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setViewerOpen(false);
              }}
              title="Close"
            >
              <X size={18} />
            </button>

          <div className="p-4 max-w-[90vw] max-h-[90vh]">
            <img
              src={fileUrl}
              alt={message?.file_name || "image"}
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          </div>
          </div>
      )}

      <div className={`group flex gap-1 px-1 py-0.5 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}>
        {/* Avatar column */}
        <div
          onClick={() => {
                if (!message?.sender?.id) return;
                navigate(`/user-profile?id=${message.sender.id}`);
              }}
          className="w-8 shrink-0 cursor-pointer">
          {showAvatar && (
            <Avatar
              src={senderAvatar}
              
              name={senderName || " "}
              size="sm"
              showStatus={false}
            />
          )}
        </div>

        <div className={`flex flex-col max-w-[65%] ${isOwn ? "items-end" : "items-start"}`}>
          {/* Sender name for group chats */}
          {!isOwn && showSenderName && senderName && (
            <span className="text-[11px] text-zinc-400 mb-0.5">{senderName}</span>
          )}

          <div className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
            {/* Message bubble */}
            <div
              className={`px-3 py-2 rounded-2xl text-sm relative ${
                isOwn 
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white" 
                  : "bg-zinc-800 text-zinc-100"
              }`}
            >
              {/* File/Image attachment */}
              {fileUrl && (
                <div className="mb-2">
                  {isImage ? (
                    <button 
                      type="button" 
                      className="block" 
                      onClick={() => setViewerOpen(true)} 
                      title="View"
                    >
                      <img
                        src={fileUrl}
                        alt={message?.file_name || "image"}
                        className="max-w-full rounded-lg max-h-48 object-cover hover:opacity-90"
                        loading="lazy"
                      />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-black/20 rounded-lg">
                      <FileText size={18} className="opacity-80" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm truncate">
                          {reduceText(message?.file_name || "Document", 20)}
                        </div>
                        <div className="text-[11px] opacity-70 truncate">
                          {message?.file_type || "file"}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="p-1.5 rounded-lg hover:bg-black/20"
                        title="Open"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpen();
                        }}
                      >
                        <ExternalLink size={16} />
                      </button>

                      <button
                        type="button"
                        className="p-1.5 rounded-lg hover:bg-black/20"
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload();
                        }}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Edit mode */}
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-2 py-1 bg-black/20 rounded text-white text-sm resize-none"
                    rows="3"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-2 py-1 text-xs bg-black/30 hover:bg-black/50 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded"
                    >
                      {isLoadingEditing ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Message content */}
                            <div className="flex gap-1 justify-center align-bottom">
                            <div>
                              {!hideAutoFileText({
                              fileUrl,
                              isImage,
                              content: message.content || message.original_content,
                              fileName: message?.file_name,
                              }) && (message.content || message.original_content)}
                              
                              {message.is_edited && <span className="text-xs opacity-60 ml-1">(edited)</span>}
                            </div>
                            
                            <span className="text-[0.6rem] text-gray-300 transition-opacity flex justify-end items-end-safe gap-1">


                              {isOwn && (() => {
                              const st = getMsgStatus(message);
                              if (st === "opened") return <Eye size={14} className="opacity-80" />;
                              if (st === "delivered") return <CheckCheck size={14} className="opacity-80" />;
                              return <Check size={14} className="opacity-80" />;
                              })()}
                            </span>
                            </div>
                          </>
                          )}
                        </div>

                        {/* Actions menu */}
            {isOwn && conversationId && !isEditing && (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="More"
                >
                  <MoreVertical size={16} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 -top-20 mt-1 w-32 bg-zinc-800 rounded-lg shadow-lg border border-zinc-700 z-50">
                    <button
                      type="button"
                      onClick={handleEditClick}
                      disabled={deleting}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-zinc-700 disabled:opacity-50"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteModalOpen(true);
                        setMenuOpen(false);
                      }}
                      disabled={deleting}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Timestamp and status - ALWAYS VISIBLE */}
          <span className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
            <span>{formatTime(ts)}</span>

            {isOwn && (() => {
              const st = getMsgStatus(message);
              if (st === "opened") return <Eye size={12} className="opacity-70" />;
              if (st === "delivered") return <CheckCheck size={12} className="opacity-70" />;
              return <Check size={12} className="opacity-70" />;
            })()}
          </span>
        </div>
      </div>

      {/* Delete Confirmation Modal - WhatsApp Style */}
      {deleteModalOpen && (
        <div 
          className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-4"
          onClick={() => !deleting && setDeleteModalOpen(false)}
        >
          <div 
            className="bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm border border-zinc-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <h3 className="text-lg font-semibold text-white mb-3">Delete message?</h3>
              
              {deleteError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {deleteError}
                </div>
              )}
              
              <div className="space-y-2">
                {/* Delete for Everyone - only if within 1 hour */}
                {canDeleteForEveryone && (
                  <button
                    type="button"
                    onClick={() => handleDelete('everyone')}
                    disabled={deleting}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? "Deleting..." : "Delete for everyone"}
                  </button>
                )}
                
                {/* Delete Message - always available */}
                <button
                  type="button"
                  onClick={() => handleDelete('me')}
                  disabled={deleting}
                  className="w-full px-4 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-zinc-200 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Delete Message"}
                </button>
                
                {/* Info text if can't delete for everyone */}
                {!canDeleteForEveryone && (
                  <p className="text-xs text-zinc-500 text-center mt-2">
                  </p>
                )}
              </div>
            </div>
            
            {/* Cancel button */}
            <div className="border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="w-full px-4 py-3 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}