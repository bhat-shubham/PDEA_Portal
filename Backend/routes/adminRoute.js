/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const route = express.Router();
const {
  adminRegistration,
  adminLogin,
  adminLogout,
  teacherlist,
  adminProfile,
} = require("../controllers/adminController");
const auth = require("../middleware/auth");
const protectRoute = require("../controllers/protectRoute");

route.post("/register", adminRegistration);
route.post("/login", adminLogin);
route.post("/logout", adminLogout); // Admin logout route
route.get("/teacherlist", teacherlist);
route.post("/verify", protectRoute);
route.get("/profile",auth, adminProfile);

module.exports = route;
