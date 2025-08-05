/* eslint-disable @typescript-eslint/no-require-imports */

// import  bcrypt from 'bcrypt';
const bcrypt = require("bcrypt");

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { Teacher } = require("../models/studentSchema");

dotenv.config();

const teacherRegisration = async (req, res) => {
  const { firstname, lastname, email, password, branch } = req.body;
  console.log("Registration data:", email, password, branch);

  const existingTeacher = await Teacher.findOne({
    email: email,
  });

  if (existingTeacher) {
    return res.status(400).json({
      message: "Teacher already exists with this email",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newTeacher = new Teacher({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    branch,
  });

  await newTeacher.save();
  res.status(200).json({
    message: "Teacher registered successfully",
    teacher: {
      name: `${firstname} ${lastname}`,
      email: email,
      branch: branch,
    },
  });
};

const teacherLogin = async (req, res) => {
  const { email, password } = req.body;

  const teacher = await Teacher.findOne({ email });

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  const isMatch = await bcrypt.compare(password, teacher.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: teacher._id },
    process.env.JWT_SECRET,

  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });

  return res.status(200).json({
    message: "Teacher logged in successfully",
    token,
    teacher: {
      id: teacher._id,
      email: teacher.email,
      branch: teacher.branch,
      name: `${teacher.firstname} ${teacher.lastname}`,
    },
  });
};


const teacherLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // set to true only in production HTTPS
    sameSite: "Lax", // 'Lax' is more forgiving than 'Strict'
    path: "/", // MUST match the original cookie path
  });
  res.status(200).json({ message: "Teacher logged out successfully" });
};

const teacherDetails = async (req, res) => {
  const teacherId = req.user.id; // Assuming the user ID is stored in req.user.id
  const teacher = await Teacher.findById(teacherId).select("-password"); // Exclude password from the response
  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }
  res.status(200).json({
    message: "Teacher details fetched successfully",
    teacher: {
      id: teacher._id,
      firstname: teacher.firstname,
      lastname: teacher.lastname,
      email: teacher.email,
      branch: teacher.branch,
    },
  });
};

module.exports = {
  teacherLogin,
  teacherRegisration,
  teacherLogout,
  teacherDetails,
};
