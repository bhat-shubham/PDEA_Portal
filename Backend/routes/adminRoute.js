/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const route = express.Router();
const {
  adminRegistration,
  adminLogin,
  adminLogout,
  teacherlist,
  adminProfile,
  notices,
  fetchNotices
} = require("../controllers/adminController");
const auth = require("../middleware/auth");
const protectRoute = require("../middleware/protectRoute");

route.post("/register", adminRegistration);
route.post("/login", adminLogin);
route.post("/logout", adminLogout); // Admin logout route
route.get("/teachers", teacherlist);
route.post("/verify", protectRoute);
route.get("/profile", auth, adminProfile);
route.post("/notice", auth, notices); //create notice
route.get("/notice", auth, fetchNotices); //get notice

module.exports = route;
