/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

const Notices = mongoose.model("notices", noticeSchema);

module.exports = Notices;
