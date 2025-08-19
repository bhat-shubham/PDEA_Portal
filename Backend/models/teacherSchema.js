/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  branch: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "teacher",
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = { Teacher };
