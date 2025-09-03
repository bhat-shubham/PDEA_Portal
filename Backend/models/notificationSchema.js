/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");
const { type } = require("os");

const notificationSchema = new mongoose.Schema({
  classname: {
    required: true,
    type: String,
  },
  studentName: {
    required: true,
    type: String,
  },
  subject: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
  teacherID: {
    type: String,
  },
  studentID: {
    type: String,
  },
  classID: {
    type: String,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = { Notification };
