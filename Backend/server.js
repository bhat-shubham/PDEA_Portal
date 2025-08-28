/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const dbConnection = require("./config/db");
const adminRoutes = require("./routes/adminRoute");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const cookie = require("cookie");

const app = express();
const httpServer = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn("[BOOT] Missing JWT_SECRET in env!");
}

const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

app.set("io", io);

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dbConnection();
io.use((socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie
      ? cookie.parse(socket.handshake.headers.cookie)
      : {};

    const token = cookies["token"];

    console.log("[SOCKET AUTH] token present:", Boolean(token), token);
    console.log("[SOCKET HANDSHAKE HEADERS]", socket.handshake.headers);
    if (!token) return next(new Error("Authentication error: Token missing"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[SOCKET AUTH] decoded:", decoded);

    socket.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    console.log("[SOCKET AUTH] user:", socket.user);

    next();
  } catch (err) {
    console.error("[SOCKET AUTH ERROR]", err.message);
    next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user.id;
  socket.join(userId.toString());
  console.log(`[SOCKET] User ${userId} connected with socket ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log("[SOCKET] disconnected:", socket.id, "reason:", reason);
  });

  socket.on("ping", () => socket.emit("pong"));
});

app.use("/admin", adminRoutes);
app.use("/teacher", teacherRoutes);
app.use("/student", studentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("[EXPRESS ERROR]", err);
  res.status(500).json({ message: "Internal server error" });
});

httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
