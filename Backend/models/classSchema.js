const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: String,
  subject: String,

  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  createdAt: { type: Date, default: Date.now },
});
const Class = mongoose.model("Class", classSchema);
module.exports = Class;
