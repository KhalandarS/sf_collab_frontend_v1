import { io } from "socket.io-client";
import { SOCKET_API_URL } from "./config";

// ✅ FIX: Module-level variable — created once, reused by every caller.
// The original version called io() on every invocation, so each component
// (NotificationContext, ChatNotificationProvider, etc.) opened its own separate
// WebSocket connection. The server saw multiple connections per user, and events
// like 'notifications_marked_read' emitted to one socket were never received by
// the others — which is why the bell badge wasn't clearing.
let _instance = null;

export const getSocketInstance = () => {
  if (_instance) return _instance;

  _instance = io(SOCKET_API_URL, {
    auth: {
      token: localStorage.getItem("access_token"),
    },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return _instance;
};

// Call this on logout so the next login gets a fresh connection with the new token
export const destroySocketInstance = () => {
  if (_instance) {
    _instance.disconnect();
    _instance = null;
  }
};