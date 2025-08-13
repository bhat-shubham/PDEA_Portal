/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: Number,
  password: String,
  attendance: {
    date: { type: Date, default: Date.now, required: true },
    present: { type: Boolean, required: true },
  },
});
const Student = mongoose.model("Student", studentSchema);



module.exports = { Student };
