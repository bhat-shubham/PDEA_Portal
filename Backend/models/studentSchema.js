/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
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
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    mobile: {
      type: String, // changed to String to allow leading zeros
      required: true,
      match: [/^\d{10}$/, "Mobile number must be exactly 10 digits"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // security: enforce minimum length
    },
    role: {
      type: String,

      default: "student",
    },

    parentPhone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Parent phone must be 10 digits"],
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
  },
  { timestamps: true }
);

// Indexing for faster lookups
// studentSchema.index({ email: 1 });

const Student = mongoose.model("Student", studentSchema);

module.exports = { Student };
