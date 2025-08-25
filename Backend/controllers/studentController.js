/* eslint-disable @typescript-eslint/no-require-imports */
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const { Student } = require("../models/studentSchema");
const { Class } = require("../models/classSchema");
const { Notification } = require("../models/notificationSchema");

const studentRegistration = async (req, res) => {
  const { firstname, lastname, email, mobile, password, parentPhone, branch } =
    req.body;
  console.log(req.body);

  const isStudentExist = await Student.findOne({ email: email });

  if (isStudentExist) {
    return res.status(400).send("Student already exists with this email");
  }

  bcrypt.genSalt(10, async (err, salt) => {
    if (err) {
      return res.status(500).send("Error generating salt");
    }
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        return res.status(500).send("Error hashing password");
      }

      const newStudent = new Student({
        firstname,
        lastname,
        email,
        mobile,
        password: hash,
        parentPhone,
        branch,
      });
      await newStudent.save();
    });
  });

  res.status(200).json({
    message: "Student registered successfully",
    student: {
      name: `${firstname} ${lastname}`,
      email: email,
      mobile: mobile,
      branch: branch,
      parentPhone: parentPhone,
    },
  });
};

const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res
        .status(404)
        .json({ message: "Student not found with this email" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { email: email, role: student.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    console.log("Login successful:", student);
    return res.status(200).json({
      message: "Login successful",
      token,
      student: {
        name: student.name,
        email: student.email,
        mobile: student.mobile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const studentLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logout successful" });
};

const studentProfile = async (req, res) => {
  try {
    const email = req.user.email;
    console.log("Fetching student details for email:", email);
    const student = await Student.findOne({ email: email }).select("-password");
    // console.log(teacher);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.status(200).json({
      message: "Student profile fetched successfully.",
      student: {
        id: student._id,
        firstname: student.firstname,
        lastname: student.lastname,
        email: student.email,
        branch: student.branch,
        phone: student.mobile,
      },
    });
  } catch (error) {
    console.error("[PROFILE ERROR]", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const joinClass = async (req, res) => {
  try {
    const { classCode } = req.body;
    const studentEmail = req.user.email;

    console.log("Class code:", classCode);
    console.log("Student email:", studentEmail);

    const classResult = await Class.findOne({ class_code: classCode });
    const student = await Student.findOne({ email: studentEmail });

    if (!classResult || !student) {
      return res.status(404).json({ message: "Class or student not found" });
    }

    const notification = new Notification({
      studentName: `${student.firstname} ${student.lastname}`,
      classname: classResult.name,
      status: "pending",
    });
    await notification.save();

    const io = req.app.get("io");
    console.log(classResult.teacher.toString());
    io.to(classResult.teacher.toString()).emit(
      "new_notification",
      notification
    );

    return res.status(200).json({
      message: "Join request sent successfully",
      notification,
    });
  } catch (error) {
    console.error("[JOIN CLASS ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  studentRegistration,
  studentLogin,
  studentLogout,
  studentProfile,
  joinClass,
};
