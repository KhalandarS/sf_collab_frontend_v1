import { io } from "socket.io-client";
import { SOCKET_API_URL } from "./config";

export const getSocketInstance = () => io(SOCKET_API_URL, {
      auth: {
        token: localStorage.getItem("access_token"),
      },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });