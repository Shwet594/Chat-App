import { io } from "socket.io-client";

export const socket = io(
  "https://chat-app-hc7g.onrender.com/api",
  {
    autoConnect: false,
    withCredentials: true,
  }
);