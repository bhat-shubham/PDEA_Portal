/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  classname: {
    required: true,
    type: String,
  },
  studentName: {
    required: true,
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = { Notification };
