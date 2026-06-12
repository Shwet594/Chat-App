import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chat-app-teal-seven-33.vercel.app",
    credentials: true,
  },
});

const userSocketMap = {};

export const getReceiverSocketId = (
  userId
) => userSocketMap[userId];

io.on("connection", (socket) => {
  console.log(
    "User connected:",
    socket.id
  );

  const userId =
    socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit(
    "getOnlineUsers",
    Object.keys(userSocketMap)
  );

  socket.on(
    "joinGroup",
    (groupId) => {
      socket.join(groupId);
    }
  );

  socket.on(
    "leaveGroup",
    (groupId) => {
      socket.leave(groupId);
    }
  );

  socket.on("disconnect", () => {
    delete userSocketMap[userId];

    io.emit(
      "getOnlineUsers",
      Object.keys(userSocketMap)
    );

    console.log(
      "User disconnected:",
      socket.id
    );
  });
});

export { io, app, server };