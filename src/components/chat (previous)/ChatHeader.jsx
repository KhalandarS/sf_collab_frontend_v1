/**
 * ChatHeader Component - Fixed Version
 * 
 * FIXES:
 * 1. Profile pictures display correctly
 * 2. Better status handling
 * 3. Proper menu closing behavior
 * 4. LEAVE GROUP with styled modal (no browser confirm)
 * 5. Uses correct API function: leaveConversation
 */

import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { getProfilePicture } from "@/utils/getProfilePicture";
import { ArrowLeft, LogOut, MoreVertical } from "lucide-react";
import { chatAPI } from "@/utils/APIs/chatApi";

const ChatHeader = ({ 
  conversation, 
  currentUserId, 
  statusText = "", 
  presenceStatus = "offline", 
  onAvatarClick, 
  setSidebarOpen = () => {}, 
  isMobile,
  onLeaveGroup = null // Optional callback when user leaves
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState(null);
  const menuRef = useRef(null);
  const optionsRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setOptionsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!conversation) return null;

  // Get other participant for direct conversations
  const otherParticipant =
    conversation.conversation_type === "direct"
      ? conversation.participants?.find((p) => String(p.id) !== String(currentUserId))
      : null;

  // Get display name
  const displayName =
    conversation.name ||
    (otherParticipant
      ? `${otherParticipant.firstName || otherParticipant.first_name || ""} ${otherParticipant.lastName || otherParticipant.last_name || ""}`.trim()
      : "Chat");

  // Status color based on presence
  const statusColor =
    presenceStatus === "online"
      ? "text-emerald-500"
      : presenceStatus === "idle"
        ? "text-yellow-400"
        : "text-zinc-500";

  const handleMenuToggle = () => {
    if (!onAvatarClick) return;
    setMenuOpen((v) => !v);
  };

  const handleViewProfile = () => {
    setMenuOpen(false);
    onAvatarClick?.();
  };

  // Handle leaving group chat
  const handleLeaveGroup = async () => {
    if (!conversation?.id) return;
    
    try {
      setIsLeaving(true);
      setLeaveError(null);
      
      // Use the correct API function
      await chatAPI.leaveConversation(conversation.id);
      
      setLeaveModalOpen(false);
      
      // Call the optional callback
      if (onLeaveGroup) {
        onLeaveGroup(conversation.id);
      }
      
      // Emit event for ChatDock to sync
      window.dispatchEvent(new CustomEvent("chat:conversationLeft", { 
        detail: { conversationId: conversation.id } 
      }));
      
      // Navigate away from the chat
      window.location.href = '/chat';
    } catch (error) {
      console.error('Failed to leave group:', error);
      const errorMsg = error?.response?.data?.error || 'Failed to leave group. Please try again.';
      setLeaveError(errorMsg);
    } finally {
      setIsLeaving(false);
    }
  };

  // Check if this is a group chat (not direct, not general)
  const isGroupChat = conversation.conversation_type === 'group';
  const isGeneralChat = conversation.conversation_type === 'general';

  return (
    <>
      <div className="h-16 px-4 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center" ref={menuRef}>
            {isMobile && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                title="Toggle sidebar"
              >
                <ArrowLeft size={30} />
              </button>
            )}
            
            <button
              type="button"
              onClick={handleMenuToggle}
              disabled={!onAvatarClick}
              className={`rounded-full ${onAvatarClick ? "cursor-pointer" : "cursor-default"}`}
              aria-label="Open profile menu"
            >
              <Avatar
                src={getProfilePicture(otherParticipant)}
                name={displayName}
                size="md"
                presenceStatus={presenceStatus}
                showStatus={conversation.conversation_type === "direct"}
              />
            </button>

            {/* Profile Menu Dropdown */}
            {menuOpen && (
              <div className="absolute left-0 top-12 z-50 w-44 rounded-xl border border-zinc-700/60 bg-zinc-900/95 shadow-xl backdrop-blur">
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-800/70 rounded-xl"
                  onClick={handleViewProfile}
                >
                  View profile
                </button>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="font-semibold text-white text-sm truncate">{displayName}</h2>
            {conversation.conversation_type === "direct" && (
              <p className={`text-xs ${statusColor}`}>{statusText}</p>
            )}
            {(isGroupChat || isGeneralChat) && (
              <p className="text-xs text-zinc-500">
                {conversation.participants?.length || 0} members
              </p>
            )}
          </div>
        </div>

        {/* Options menu for group chats (not general chat) */}
        {isGroupChat && !isGeneralChat && (
          <div className="relative" ref={optionsRef}>
            <button
              type="button"
              onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Options"
            >
              <MoreVertical size={20} />
            </button>

            {optionsMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-zinc-700/60 bg-zinc-900/95 shadow-xl backdrop-blur overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setOptionsMenuOpen(false);
                    setLeaveModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut size={16} />
                  Leave Group
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Leave Group Confirmation Modal */}
      {leaveModalOpen && (
        <div 
          className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-4"
          onClick={() => !isLeaving && setLeaveModalOpen(false)}
        >
          <div 
            className="bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm border border-zinc-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <h3 className="text-lg font-semibold text-white mb-2">Leave Group</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Are you sure you want to leave "{displayName}"? You won't be able to see messages or participate anymore.
              </p>
              
              {leaveError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {leaveError}
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setLeaveModalOpen(false)}
                  disabled={isLeaving}
                  className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-200 font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLeaveGroup}
                  disabled={isLeaving}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-colors disabled:opacity-50"
                >
                  {isLeaving ? "Leaving..." : "Leave"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHeader;