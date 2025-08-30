/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const route = express.Router();
const {
  teacherRegisration,
  teacherLogin,
  teacherLogout,
  teacherDetails,
  createClass,
  getClasses,
  deleteClass,
  fetchNotification,
  approveStudent,
} = require("../controllers/teachercontroller");
const auth = require("../middleware/auth");

route.post("/register", teacherRegisration);
route.post("/login", teacherLogin);
route.post("/logout", teacherLogout);
route.get("/info", auth, teacherDetails);
route.post("/class", auth, createClass);
route.get("/getClass", auth, getClasses);
route.get("/notifications", auth, fetchNotification);
route.put("/approveStudent", auth, approveStudent);
route.delete("/deleteClass/:classId", auth, deleteClass);

module.exports = route;
