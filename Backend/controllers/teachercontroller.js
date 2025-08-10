/* eslint-disable @typescript-eslint/no-require-imports */

// import  bcrypt from 'bcrypt';
const bcrypt = require("bcrypt");

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { Teacher } = require("../models/studentSchema");

dotenv.config();

const teacherRegisration = async (req, res) => {
  const { firstname, lastname, email, password, branch } = req.body;
  // console.log("Registration data:", email, password, branch);

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

  try {
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found with this email." });
    }

    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // console.log("token",token)

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful.",
      token,
      teacher: {
        id: teacher._id,
        firstname: teacher.firstname,
        lastname: teacher.lastname,
        email: teacher.email,
        branch: teacher.branch,
      },
    });
  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


const teacherLogout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, 
      sameSite: "Lax",
      path: "/", 
    });
    res.status(200).json({ message: "Teacher logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" , error});
  }
};
const teacherDetails = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const teacher = await Teacher.findById(teacherId).select("-password");
    // console.log(teacher);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    res.status(200).json({
      message: "Teacher profile fetched successfully.",
      teacher: {
        id: teacher._id,
        firstname: teacher.firstname,
        lastname: teacher.lastname,
        email: teacher.email,
        branch: teacher.branch,
      },
    });
  } catch (error) {
    console.error("[PROFILE ERROR]", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  teacherLogin,
  teacherRegisration,
  teacherLogout,
  teacherDetails,
};
