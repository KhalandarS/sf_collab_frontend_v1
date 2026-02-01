import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  Bell,
  CheckCircle,
  Info,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { notificationColors, priorityStyles } from "./colors";
import { API_URL } from "@/utils/config";

const iconsByType = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

export default function NotificationItem({ notification, onMarkAsRead }) {
  const {
    id,
    title,
    message,
    type = "info",
    priority = "medium",
    isRead,
    createdAt,
    user,
  } = notification;

  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isRead) {
          onMarkAsRead(notification);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [id, isRead, onMarkAsRead, notification]);

  const color = notificationColors[type] ?? notificationColors.info;
  const priorityClass = priorityStyles[priority] ?? "";
  const Icon = iconsByType[type] ?? Bell;

  return (
    <motion.div
      ref={ref}
      layout
      initial={false}
      animate={{
        opacity: isRead ? 0.65 : 1,
        scale: isRead ? 0.985 : 1,
      }}
      transition={{
        duration: 2.00,
        ease: "easeOut",
      }}
      className={`
        relative flex gap-4 rounded-xl border p-4
        ${color.bg}
        ${color.border}
        ${priorityClass}
        ${!isRead ? "bg-white/[0.02]" : ""}
        hover:bg-white/[0.05]
      `}
    >
      {/* ================= UNREAD DOT ================= */}
      <AnimatePresence>
        {!isRead && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-3 right-3 h-2 w-2 rounded-full bg-indigo-400"
          />
        )}
      </AnimatePresence>

      {/* ================= ICON / AVATAR ================= */}
      <div className="shrink-0">
        {user?.profilePicture ? (
          <img
            src={user.profilePicture.startsWith("http")
              ? user.profilePicture
              : `${API_URL}${user.profilePicture}`
            }
            alt={user.firstName}
            className="h-10 w-10 rounded-lg object-cover"
          />
        ) : (
          <motion.div
            layout
            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-black/20 ${color.icon}`}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <motion.h4
            layout
            className={`font-semibold leading-snug ${color.text}`}
          >
            {title}
          </motion.h4>

          <motion.span
            layout
            className="text-xs text-white/40 whitespace-nowrap"
          >
            {new Date(createdAt).toLocaleTimeString()}
          </motion.span>
        </div>

        {message && (
          <motion.p
            layout
            initial={false}
            animate={{ opacity: isRead ? 0.7 : 1 }}
            transition={{ duration: 0.3 }}
            className="mt-1 text-sm text-white/60 leading-relaxed"
          >
            {message}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
