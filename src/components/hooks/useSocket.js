

import { SOCKET_API_URL } from '@/utils/config';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';




const useSocket = (token) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [lastActiveAt, setLastActiveAt] = useState({}); 
  const [lastSeenAt, setLastSeenAt] = useState({});     


  useEffect(() => {
    if (!token) return;

    const newSocket = io(SOCKET_API_URL, {
      query: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('🔌 Socket connected');
      setIsConnected(true);
      newSocket.emit('get_online_users');
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('online_users', (data) => {
      const ids = (data.user_ids || []).map(String);
      setOnlineUsers(ids);

      // mark online users as active "now" if we don't have activity yet
      const now = Date.now();
      setLastActiveAt((prev) => {
        const next = { ...prev };
        ids.forEach((id) => {
          if (!next[id]) next[id] = now;
        });
        return next;
      });
    });


    newSocket.on('user_status', (data) => {
      const id = String(data.user_id);
      const now = Date.now();

      if (data.status === 'online') {
        setOnlineUsers((prev) => [...new Set([...prev.map(String), id])]);
        setLastActiveAt((prev) => ({ ...prev, [id]: now }));
      } else {
        setOnlineUsers((prev) => prev.map(String).filter((x) => x !== id));
        setLastSeenAt((prev) => ({ ...prev, [id]: now }));
      }
    });

    newSocket.on('user_activity', ({ user_id, ts }) => {
      const id = String(user_id);
      setLastActiveAt((prev) => ({ ...prev, [id]: ts || Date.now() }));
    });



    setSocket(newSocket);

  const ping = () => newSocket.emit('user_activity', { ts: Date.now() });

  const onMove = () => ping();
  const onKey = () => ping();
  const onScroll = () => ping();

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("keydown", onKey);
  window.addEventListener("scroll", onScroll, { passive: true });

  const interval = setInterval(ping, 30000);

  return () => {
    clearInterval(interval);
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("scroll", onScroll);
    newSocket.close();
  };


    return () => {
      newSocket.close();
    };
  }, [token]);

  return { socket, isConnected, onlineUsers, lastActiveAt, lastSeenAt };
};

export default useSocket;