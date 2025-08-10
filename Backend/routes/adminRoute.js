/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const route = express.Router();
const {
  adminRegistration,
  adminLogin,
  adminLogout,
  teacherlist,
} = require("../controllers/adminController");
const auth = require("../middleware/auth");
const protectRoute = require("../controllers/protectRoute");

route.post("/register", adminRegistration);
route.post("/login", adminLogin);
route.post("/logout", adminLogout); // Admin logout route
route.get("/teacherlist", auth, teacherlist);
route.post("/verify", protectRoute); // Route to get the list of teachers

module.exports = route;
