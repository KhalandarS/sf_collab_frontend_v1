import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { getProfilePicture } from "@/utils/getProfilePicture";
import { ArrowLeft, Menu } from "lucide-react";

const ChatHeader = ({ conversation, currentUserId, statusText="", presenceStatus="offline", onAvatarClick, setSidebarOpen = () => {}, isMobile }) => {
  

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // ...your existing otherParticipant, displayName, avatarUrl, statusColor...

  const otherParticipant =
    conversation.conversation_type === "direct"
      ? conversation.participants?.find((p) => String(p.id) !== String(currentUserId))
      : null;

  const displayName =
    conversation.name ||
    (otherParticipant
      ? `${otherParticipant.firstName || otherParticipant.first_name || ""} ${otherParticipant.lastName || otherParticipant.last_name || ""}`.trim()
      : "Chat");


  const statusColor =
    presenceStatus === "online"
      ? "text-emerald-500"
      : presenceStatus === "idle"
        ? "text-yellow-400"
        : "text-zinc-500";
  if (!conversation) return null;
  return (
    <div className="h-16 px-4 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative" ref={menuRef}>
          {
            isMobile &&
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Toggle sidebar"
            >
              <ArrowLeft size={30} />
            </button>
          }
          <button
            type="button"
            onClick={() => {
              if (!onAvatarClick) return;
              setMenuOpen((v) => !v);
            }}
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

          {menuOpen && (
            <div className="absolute left-0 top-12 z-50 w-44 rounded-xl border border-zinc-700/60 bg-zinc-900/95 shadow-xl backdrop-blur">
              <button
                className="w-full text-left px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-800/70 rounded-xl"
                onClick={() => {
                  setMenuOpen(false);
                  onAvatarClick?.();
                }}
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
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

