import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { X, Download, FileText, ExternalLink, Check, CheckCheck, Eye } from "lucide-react";
import Avatar from "./Avatar";
import { getProfilePicture } from "@/utils/getProfilePicture";




// Files are typically served from the backend host (often NOT /api)
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

  // If backend returns JSON error (401/403), blob will be invalid for PDFs/images
  if (!res.ok) {
    let hint = "";
    try {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const j = await res.json();
        hint = j?.message ? ` (${j.message})` : "";
      }
    } catch {
      // ignore
    }
    throw new Error(`Download failed (${res.status})${hint}`);
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
    // last resort: open raw URL (may fail if endpoint requires Authorization header)
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

async function openInNewTab(url, token) {
  try {
    const blob = await fetchBlobWithAuth(url, token);
    const href = URL.createObjectURL(blob);
    window.open(href, "_blank", "noopener,noreferrer");
    // give the new tab time to load, then clean up
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


export default function MessageBubble({ message, isOwn, showAvatar, showSenderName = false }) {
  const getMsgStatus = (msg) => {
  const s = String(msg?.status || msg?.delivery_status || "").toLowerCase();

  // opened/read
  if (s === "read" || s === "seen" || msg?.read_at || msg?.seen_at) return "opened";

  // delivered
  if (s === "delivered" || msg?.delivered_at) return "delivered";

  // default: sent (exists on server)
  return "sent";
};


  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const { access_token: token } = useSelector((state) => state.auth || {});
  const [viewerOpen, setViewerOpen] = useState(false);

  const ts =
    message?.created_at ??
    message?.createdAt ??
    message?.timestamp ??
    message?.sent_at ??
    message?.sentAt ??
    null;

  const senderName = useMemo(() => {
    if (message?.sender) {
      return `${message.sender.firstName || ""} ${message.sender.lastName || ""}`.trim();
    }
    return message?.sender_name || message?.senderName || "";
  }, [message]);

  const fileUrl = message?.file_url ? resolveUrl(message.file_url) : null;

  const isImage =
    Boolean(message?.is_image) ||
    (message?.file_type && (String(message.file_type) === "image" || String(message.file_type).startsWith("image/"))) ||
    message?.message_type === "image";

  const onDownload = useCallback(async () => {
    if (!fileUrl) return;
    await forceDownload(fileUrl, message?.file_name || "file", token);
  }, [fileUrl, message?.file_name, token]);

  const onOpen = useCallback(async () => {
    if (!fileUrl) return;
    await openInNewTab(fileUrl, token);
  }, [fileUrl, token]);

  if (message.message_type === "system") {
    return (
      <div className="flex justify-center my-3">
        <div className="px-3 py-1.5 bg-zinc-800/50 rounded-full text-zinc-500 text-xs">
          {message.content || message.original_content}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Image Viewer Modal */}
      {viewerOpen && isImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={() => setViewerOpen(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Download icon is always top-right */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white"
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

            <img
              src={fileUrl}
              alt={message?.file_name || "image"}
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <div className={`group flex gap-1 px-1 py-0.01 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}>
        <div className={`visible w-8 shrink-0`}>
          {showAvatar && (
            <Avatar
              src={
                getProfilePicture(
                  message?.sender)
              }
              name={senderName || " "}
              size="sm"
              showStatus={false}
            />
          )}

        </div>

        <div className={`flex flex-col max-w-[65%] ${isOwn ? "items-end" : "items-start"}`}>
          {!isOwn && showSenderName && senderName && (
            <span className="text-[11px] text-zinc-400 mb-0">{senderName}</span>
          )}

          <div className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
            <div
              className={`px-3 py-2 rounded-2xl text-sm ${isOwn ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white" : "bg-zinc-800 text-zinc-100"
                }`}
            >
              {fileUrl && (
                <div className="mb-2">
                  {isImage ? (
                    <button type="button" className="block" onClick={() => setViewerOpen(true)} title="View">
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
                        <div className="text-sm truncate">{message?.file_name || "Document"}</div>
                        <div className="text-[11px] opacity-70 truncate">{message?.file_type || "file"}</div>
                      </div>

                      {/* Open via auth-fetch + blob so PDFs actually render even if endpoint needs Authorization */}
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

              {!hideAutoFileText({
                fileUrl,
                isImage,
                content: message.content || message.original_content,
                fileName: message?.file_name,
              }) && (message.content || message.original_content)}


              {message.is_edited && <span className="text-xs opacity-60 ml-1">(edited)</span>}
            </div>

            <span className="text-[10px] text-zinc-600 mt-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <span>{formatTime(ts)}</span>

              {isOwn && (() => {
                const st = getMsgStatus(message);
                if (st === "opened") return <Eye size={14} className="opacity-80" />;
                if (st === "delivered") return <CheckCheck size={14} className="opacity-80" />;
                return <Check size={14} className="opacity-80" />;
              })()}
            </span>

          </div>
        </div>
      </div>
    </>
  );
}
