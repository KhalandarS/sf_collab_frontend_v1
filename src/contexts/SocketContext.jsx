import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_API_URL = import.meta.env.VITE_SOCKET_API_URL || 'http://localhost:5001';

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const audioRef = useRef(null);

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const s = io(SOCKET_API_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    const handleNotification = (notif) => {
      try {
        if (!audioRef.current) {
          audioRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
        }

        const oscillator = audioRef.current.createOscillator();
        const gainNode = audioRef.current.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioRef.current.destination);
        oscillator.frequency.setValueAtTime(800, audioRef.current.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioRef.current.currentTime);
        oscillator.start(audioRef.current.currentTime);
        oscillator.stop(audioRef.current.currentTime + 0.2);
      } catch (err) {
        console.warn("Audio failed:", err);
      }

      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification(notif.title, { body: notif.message });
      }
    };

    s.on("notification", handleNotification);
    setSocket(s);

    return () => {
      s.off("notification", handleNotification);
      s.disconnect();
    };
  }, [localStorage.getItem("authToken")]);

  return (
    <SocketContext.Provider value={{ socket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
