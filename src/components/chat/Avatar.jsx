import React from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export default function Avatar({
  src,
  name,
  size = "md",
  // Backwards compatible: existing callers pass isOnline
  isOnline = false,
  // New: "online" | "idle" | "offline"
  presenceStatus = null,
  showStatus = true,
  className = "",
}) {
  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-14 h-14 text-lg",
  };

  const statusSizes = {
    xs: "w-2 h-2 border",
    sm: "w-2.5 h-2.5 border-[1.5px]",
    md: "w-3 h-3 border-2",
    lg: "w-3.5 h-3.5 border-2",
    xl: "w-4 h-4 border-2",
  };

  const initials =
    name
      ?.split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "";


  const resolveAvatarSrc = (value) => {
    if (!value) return null;

    // If it's already a full URL or data URI, keep it.
    if (typeof value === "string" && (/^https?:\/\//i.test(value) || value.startsWith("data:"))) {
      return value;
    }

    // Common backend shapes:
    // - "uploads/xxx.jpg" or "/uploads/xxx.jpg"
    // - just "xxx.jpg"
    // - "/default-user.jpeg"
    const v = String(value).trim();

    // If it's an absolute path but not an uploads path, treat as local public asset.
    if (v.startsWith("/") && !v.startsWith("/uploads/")) {
      return v;
    }

    const fileName = v.replace(/^\/?uploads\//, "").replace(/^\//, "");
    return `${API_BASE_URL}/users/avatars/${fileName}`;
  };


  const status = presenceStatus || (isOnline ? "online" : "offline");
  const statusColor =
    status === "online"
      ? "bg-emerald-500"
      : status === "idle"
        ? "bg-yellow-400"
        : "bg-red-500";

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      {resolveAvatarSrc(src) ? (
        <img src={resolveAvatarSrc(src)} alt={name} className={`${sizes[size]} rounded-full object-cover`} />
      ) : (
        <div
          className={`${sizes[size]} rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-semibold text-white`}
        >
          {initials}
        </div>
      )}

      {showStatus && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${statusSizes[size]} rounded-full border-zinc-900 ${statusColor}`}
          title={status}
        />
      )}
    </div>
  );
}
