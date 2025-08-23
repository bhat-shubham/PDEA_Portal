/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const dbConncction = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const PORT = process.env.PORT;

dotenv.config();

// const studentRegistration = require("./controllers/studentController");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoute");
const teacherRoutes = require("./routes/teacherRoutes");
// const { server } = require("typescript");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("connected:", socket.id);
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Replace with your client URL
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // handle form data
app.use(express.json());
dbConncction();

app.use("/admin", adminRoutes);
app.use("/teacher", teacherRoutes);
app.use("/student", studentRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
