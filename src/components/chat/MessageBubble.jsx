import React, { useMemo, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { X, Download, FileText, ExternalLink, Check, CheckCheck, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Avatar from "./Avatar";

// -------------------- FILE URL RESOLUTION --------------------
const FILE_BASE_URL =
  import.meta.env.VITE_SOCKET_API_URL ||
  (import.meta.env.VITE_API_URL
    ? String(import.meta.env.VITE_API_URL).replace(/\/api\/?$/, "")
    : "http://localhost:5001");

const resolveUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  return `${FILE_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const formatTime = (ts) => {
  if (!ts) return "";
  const d = new Date(ts);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// -------------------- AUTH FETCH HELPERS --------------------
async function fetchBlobWithAuth(url, token) {
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });

  if (!res.ok) throw new Error("Download failed");
  return res.blob();
}

async function forceDownload(url, filename, token) {
  try {
    const blob = await fetchBlobWithAuth(url, token);
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
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
    setTimeout(() => URL.revokeObjectURL(href), 60000);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

// -------------------- UTILS --------------------
function hideAutoFileText({ fileUrl, isImage, content, fileName }) {
  if (!fileUrl || !isImage || !content) return false;
  const c = String(content).trim();
  if (!c) return false;
  if (fileName && c === fileName) return true;
  if (c === fileUrl) return true;
  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(c)) return true;
  return false;
}

// ==================== COMPONENT ====================
export default function MessageBubble({ message, isOwn, showAvatar, showSenderName }) {
  const { access_token: token } = useSelector((s) => s.auth || {});
  const [viewerOpen, setViewerOpen] = useState(false);

  const fileUrl = message?.file_url ? resolveUrl(message.file_url) : null;

  const isImage =
    message?.message_type === "image" ||
    message?.file_type?.startsWith("image");

  const senderName = useMemo(() => {
    if (!message?.sender) return "";
    return `${message.sender.firstName || ""} ${message.sender.lastName || ""}`.trim();
  }, [message]);

  const ts =
    message?.created_at ||
    message?.createdAt ||
    message?.sent_at ||
    message?.sentAt;

  const markdownText = useMemo(() => {
    const raw = message?.content || message?.original_content || "";
    if (
      hideAutoFileText({
        fileUrl,
        isImage,
        content: raw,
        fileName: message?.file_name,
      })
    ) {
      return "";
    }
    return String(raw);
  }, [message, fileUrl, isImage]);

  const onDownload = useCallback(() => {
    if (fileUrl) forceDownload(fileUrl, message?.file_name, token);
  }, [fileUrl, token, message]);

  const onOpen = useCallback(() => {
    if (fileUrl) openInNewTab(fileUrl, token);
  }, [fileUrl, token]);

  const getMsgStatus = () => {
    if (message?.read_at || message?.seen_at) return "opened";
    if (message?.delivered_at) return "delivered";
    return "sent";
  };

  // -------------------- SYSTEM MESSAGE --------------------
  if (message?.message_type === "system") {
    return (
      <div className="flex justify-center my-3">
        <div className="px-3 py-1.5 bg-zinc-800/50 rounded-full text-xs text-zinc-500">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* IMAGE VIEWER */}
      {viewerOpen && isImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={() => setViewerOpen(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white"
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
          >
            <Download size={18} />
          </button>
          <button
            className="absolute top-4 left-4 p-2 text-white"
            onClick={(e) => {
              e.stopPropagation();
              setViewerOpen(false);
            }}
          >
            <X size={18} />
          </button>
          <img
            src={fileUrl}
            className="max-h-full max-w-full rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* MESSAGE */}
      <div className={`group flex gap-1 px-1 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}>
        <div className={`w-8 ${showAvatar ? "visible" : "invisible"}`}>
          {showAvatar && (
            <Avatar
              src={message.sender?.profilePicture}
              name={senderName}
              size="sm"
            />
          )}
        </div>

        <div className={`max-w-[65%] flex flex-col ${isOwn ? "items-end" : ""}`}>
          {!isOwn && showSenderName && (
            <span className="text-xs text-zinc-400">{senderName}</span>
          )}

          <div className={`px-3 py-2 rounded-2xl text-sm ${
            isOwn
              ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
              : "bg-zinc-800 text-zinc-100"
          }`}>
            {fileUrl && (
              <div className="mb-2">
                {isImage ? (
                  <img
                    src={fileUrl}
                    className="rounded-lg max-h-48 cursor-pointer"
                    onClick={() => setViewerOpen(true)}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span className="truncate">{message?.file_name}</span>
                    <button onClick={onOpen}><ExternalLink size={14} /></button>
                    <button onClick={onDownload}><Download size={14} /></button>
                  </div>
                )}
              </div>
            )}

            {markdownText && (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdownText}
              </ReactMarkdown>
            )}

            {message?.is_edited && (
              <span className="text-xs opacity-60 ml-1">(edited)</span>
            )}
          </div>

          <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
            {formatTime(ts)}
            {isOwn &&
              (getMsgStatus() === "opened" ? (
                <Eye size={12} />
              ) : getMsgStatus() === "delivered" ? (
                <CheckCheck size={12} />
              ) : (
                <Check size={12} />
              ))}
          </span>
        </div>
      </div>
    </>
  );
}
