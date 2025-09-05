/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");

const {
  studentRegistration,
  studentLogin,
  studentLogout,
  studentProfile,
  joinClass,
  studentAttendance,
} = require("../controllers/studentController");

route.post("/register", studentRegistration);
route.post("/login", studentLogin);
route.post("/logout", studentLogout);
route.get("/profile", auth, studentProfile);
route.post("/class", auth, joinClass);
route.get("/attendance", auth, studentAttendance);

module.exports = route;
