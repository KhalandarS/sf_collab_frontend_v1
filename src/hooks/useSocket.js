<<<<<<< HEAD
import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

=======
import { SOCKET_API_URL } from '@/utils/config';
import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
<<<<<<< HEAD
    const socketRef = useRef(null);

    const connectSocket = useCallback(() => {
        const token = localStorage.getItem('access_token') || localStorage.getItem('authToken');

        if (!token) {
            console.warn("Socket connection aborted: No token found.");
=======
    
    // Using a ref for the socket to avoid re-renders causing multiple connections
    const socketRef = useRef(null);

    const connectSocket = useCallback(() => {
        // 1. Get the token - checking both common naming conventions
        const token = localStorage.getItem('access_token') || localStorage.getItem('authToken');

        // 2. Only connect if we actually have a token
        if (!token) {
            console.warn("Socket connection aborted: No token found in localStorage.");
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
            return;
        }

        if (socketRef.current?.connected) return;

<<<<<<< HEAD
        // UPDATED: Added withCredentials and auth object to match Flask requirements
        const newSocket = io(SOCKET_URL, {
            auth: { token }, // Better than query for security
            transports: ['websocket'],
            withCredentials: true, // MUST match the backend CORS setting
=======
        // 3. Initialize connection
        const newSocket = io(SOCKET_API_URL, {
            query: { token },
            transports: ['websocket'],
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
            reconnectionAttempts: 5,
            reconnectionDelay: 5000,
        });

        newSocket.on('connect', () => {
            console.log('✅ Connected to WebSocket:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', (reason) => {
<<<<<<< HEAD
            console.log('❌ Disconnected:', reason);
            setIsConnected(false);
        });

        // Handle the online users list from backend
=======
            console.log('❌ Disconnected from WebSocket:', reason);
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('⚠️ Socket Connection Error:', error.message);
            setIsConnected(false);
        });

        // Handle online users list
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
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
<<<<<<< HEAD
        return () => disconnectSocket();
=======

        // Cleanup on unmount
        return () => {
            disconnectSocket();
        };
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
    }, [connectSocket, disconnectSocket]);

    return { socket, isConnected, onlineUsers, connectSocket, disconnectSocket };
};

export default useSocket;