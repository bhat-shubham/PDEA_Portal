/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const route = express.Router();

const {
  studentRegistration,
  studentLogin,
  studentLogout,
} = require("../controllers/studentController");

route.post("/register", studentRegistration);
route.post("/login", studentLogin);
route.post("/logout", studentLogout);

module.exports = route;
