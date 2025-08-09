/* eslint-disable @typescript-eslint/no-require-imports */
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { Admin } = require("../models/adminSchema");

const { Teacher } = require("../models/studentSchema");

dotenv.config();

// Admin Registration
const adminRegistration = async (req, res) => {
  const { firstname, lastname, email, password, phone } = req.body;

  try {
    // Check if admin already exists
    const isAdminExist = await Admin.findOne({ email });
    if (isAdminExist) {
      return res.status(400).json({
        message: "Admin already exists with this email",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new admin
    const newAdmin = new Admin({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phone,
    });

    await newAdmin.save();

    res.status(200).json({
      message: "Admin registered successfully",
      admin: {
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      res.status(404).json({ message: "Admin not found with " });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }

    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Admin logged in successfully",
      token: token,
      admin: {
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Admin Logout
const adminLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Admin logged out successfully" });
};

//admin authentication

const teacherlist = async (req, res) => {
  try {
    const teachers = await Teacher.find();

    if (teachers.length === 0) {
      return res.status(404).send("No teachers found");
    }

    const formattedTeachers = teachers.map((t) => ({
      firstname: t.firstname,
      email: t.email,
      branch: t.branch,
    }));

    res.status(200).json({
      message: "Teacher list fetched successfully",
      teachers: formattedTeachers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = { adminLogin, adminRegistration, adminLogout, teacherlist };
