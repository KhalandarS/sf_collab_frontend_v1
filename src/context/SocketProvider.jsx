import { SOCKET_API_URL } from "@/utils/config";
import { getSocketInstance } from "@/utils/getSocketInstance";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

const SOCKET_URL = SOCKET_API_URL

export function SocketProvider({ token, children }) {
  const socketRef = useRef(null);

  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // ✅ Normalize token properly (handles undefined, "undefined", null, "Bearer ...")
    const rawToken = typeof token === "string" ? token.trim() : "";

    const normalizedToken =
      rawToken.startsWith("Bearer ") ? rawToken.slice(7).trim() : rawToken;

    // ✅ block socket connection unless token looks valid
    const isBadToken =
      !normalizedToken ||
      normalizedToken === "undefined" ||
      normalizedToken === "null" ||
      normalizedToken.length < 10; // JWTs are long; this prevents junk tokens

    if (isBadToken) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setSocket(null);
      setIsConnected(false);
      setOnlineUsers([]);
      return;
    }

    // If already connected socket exists, don't recreate
    if (socketRef.current) return;

    const s = getSocketInstance();

    socketRef.current = s;
    setSocket(s);

    const onConnect = () => {
      setIsConnected(true);
      s.emit("get_online_users");
    };

    const onDisconnect = () => setIsConnected(false);

    const onOnlineUsers = (data) => setOnlineUsers(data.user_ids || []);

    const onUserStatus = (data) => {
      setOnlineUsers((prev) =>
        data.status === "online"
          ? Array.from(new Set([...prev, data.user_id]))
          : prev.filter((id) => id !== data.user_id)
      );
    };

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("online_users", onOnlineUsers);
    s.on("user_status", onUserStatus);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("online_users", onOnlineUsers);
      s.off("user_status", onUserStatus);

      s.close();
      socketRef.current = null;

      setSocket(null);
      setIsConnected(false);
      setOnlineUsers([]);
    };
  }, [token]);


  const value = useMemo(
    () => ({ socket, isConnected, onlineUsers }),
    [socket, isConnected, onlineUsers]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
export default SocketProvider;
export function useAppSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useAppSocket must be used inside <SocketProvider />");
  }
  return ctx;
}