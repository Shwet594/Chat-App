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
    console.log("User connected:", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    // send online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // join group room
    socket.on("joinGroup", (groupId) => {
      socket.join(groupId);
    });

    socket.on("leaveGroup", (groupId) => {
      socket.leave(groupId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      delete userSocketMap[userId];

      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

// helper function for private messages
export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};