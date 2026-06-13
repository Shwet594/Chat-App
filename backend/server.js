import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import groupRoutes from "./routes/group.route.js";

import { connectDB } from "./lib/db.js";
import { initSocket } from "./lib/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ init socket with same server
initSocket(server);

app.use(express.json({ limit: "10mb" }));

app.use(
  cors({
    origin: process.env.URL,
    credentials: true,
  })
);

app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
  connectDB();
});