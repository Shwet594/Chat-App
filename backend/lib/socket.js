import { Server } from "socket.io";

// will hold io instance
export let io;

// store user -> socket mapping
const userSocketMap = {};

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
  console.log("================================");
  console.log("CONNECTED");
  console.log("socket.id:", socket.id);
  console.log("auth:", socket.handshake.auth);

  const userId = socket.handshake.auth.userId;

  console.log("userId:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  console.log("MAP:", userSocketMap);

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
  });

  socket.on("leaveGroup", (groupId) => {
    socket.leave(groupId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
};

// helper function for private messages
export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};