import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    // Using a ref for the socket to avoid re-renders causing multiple connections
    const socketRef = useRef(null);

    const connectSocket = useCallback(() => {
        // 1. Get the token - checking both common naming conventions
        const token = localStorage.getItem('access_token') || localStorage.getItem('authToken');

        // 2. Only connect if we actually have a token
        if (!token) {
            console.warn("Socket connection aborted: No token found in localStorage.");
            return;
        }

        if (socketRef.current?.connected) return;

        // 3. Initialize connection
        const newSocket = io(SOCKET_URL, {
            query: { token },
            transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnectionDelay: 5000,
        });

        newSocket.on('connect', () => {
            console.log('✅ Connected to WebSocket:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('❌ Disconnected from WebSocket:', reason);
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('⚠️ Socket Connection Error:', error.message);
            setIsConnected(false);
        });

        // Handle online users list
        newSocket.on('get_online_users', (users) => {
            setOnlineUsers(users);
        });

        socketRef.current = newSocket;
        setSocket(newSocket);
    }, []);

    const disconnectSocket = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setSocket(null);
            setIsConnected(false);
        }
    }, []);

    useEffect(() => {
        connectSocket();

        // Cleanup on unmount
        return () => {
            disconnectSocket();
        };
    }, [connectSocket, disconnectSocket]);

    return { socket, isConnected, onlineUsers, connectSocket, disconnectSocket };
};

export default useSocket;