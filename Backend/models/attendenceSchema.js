/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");

const attendenceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    default: "absent",
  },
});

const Attendence = mongoose.model("Attendence", attendenceSchema);

module.exports = { Attendence };
