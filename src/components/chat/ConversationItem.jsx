/**
 * ConversationItem Component - Fixed Version
 * 
 * FIXES:
 * 1. Profile pictures now display correctly using getProfilePicture utility
 * 2. Better name extraction from various formats
 */

import React from "react";
import Avatar from "./Avatar";
import { getProfilePicture } from "@/utils/getProfilePicture";

const toMs = (ts) => {
  if (!ts) return null;
  if (typeof ts === "number") return ts;
  const n = Number(ts);
  if (!Number.isNaN(n)) return n;
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
};

const ConversationItem = ({
  conversation,
  isActive,
  onClick,
  onlineUsers,
  currentUserId,
  lastActiveAt = {},
  lastSeenAt = {},
  nowTs = Date.now(),
}) => {
  const isDirect = conversation.conversation_type === "direct";

  // Get other participant for direct conversations
  const otherParticipant = isDirect
    ? conversation.participants?.find((p) => String(p.id) !== String(currentUserId))
    : null;

  const otherId = otherParticipant?.id ? String(otherParticipant.id) : null;

  // Check if connected
  const connected = otherId 
    ? (onlineUsers || []).map(String).includes(otherId) 
    : false;

  const lastActiveTs = otherId ? toMs(lastActiveAt?.[otherId]) : null;
  const lastSeenTs =
    otherId
      ? toMs(
          lastSeenAt?.[otherId] ??
            otherParticipant?.last_seen ??
            otherParticipant?.lastSeen ??
            otherParticipant?.last_login ??
            otherParticipant?.lastLogin
        )
      : null;

  const diffMs = (ts) => (ts ? Math.max(0, nowTs - ts) : null);

  // Calculate presence status
  let presenceStatus = "offline";
  if (isDirect && otherId) {
    if (connected) {
      const d = diffMs(lastActiveTs);
      if (d == null || d < 5 * 60 * 1000) presenceStatus = "online";
      else if (d < 6 * 60 * 1000) presenceStatus = "idle";
      else presenceStatus = "offline";
    } else {
      presenceStatus = "offline";
    }
  }

  // Get conversation display name - Fixed to handle various formats
  const conversationName = isDirect
    ? `${otherParticipant?.firstName || otherParticipant?.first_name || ""} ${
        otherParticipant?.lastName || otherParticipant?.last_name || ""
      }`.trim() || "User"
    : conversation.name || "Group Chat";

  // Get avatar URL - Fixed to use getProfilePicture utility
  const avatarUrl = isDirect
    ? getProfilePicture(otherParticipant)
    : conversation.avatar || null;

  // Get last message preview
  const lastMessage = conversation.last_message?.content || "No messages yet";
  const lastTime = conversation.last_message?.created_at
    ? new Date(conversation.last_message.created_at).toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit" 
      })
    : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
        isActive ? "bg-zinc-800/70" : "hover:bg-zinc-800/40"
      }`}
    >
      <Avatar
        src={avatarUrl}
        name={conversationName}
        size="md"
        presenceStatus={presenceStatus}
        showStatus={isDirect}
      />

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-white truncate">{conversationName}</p>
          <span className="text-xs text-zinc-500 shrink-0">{lastTime}</span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-zinc-500 truncate">{lastMessage}</p>

          {conversation.unread_count > 0 && (
            <span className="ml-2 w-5 h-5 flex items-center justify-center bg-indigo-500 text-zinc-900 text-[10px] font-bold rounded-full shrink-0">
              {conversation.unread_count > 9 ? "9+" : conversation.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;