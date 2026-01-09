/**
 * useSocket Hook
 * Manages WebSocket connection for real-time chat
 * 
 * Put this in: src/hooks/useSocket.js
 */

import { SOCKET_API_URL } from '@/utils/config';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';




const useSocket = (token) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

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
      setOnlineUsers(data.user_ids || []);
    });

    newSocket.on('user_status', (data) => {
      setOnlineUsers((prev) =>
        data.status === 'online'
          ? [...new Set([...prev, data.user_id])]
          : prev.filter((id) => id !== data.user_id)
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token]);

  return { socket, isConnected, onlineUsers };
};

export default useSocket;