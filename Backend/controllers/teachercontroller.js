/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */

// import  bcrypt from 'bcrypt';
const bcrypt = require("bcrypt");

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { Teacher } = require("../models/teacherSchema");
const { Class } = require("../models/classSchema.js");
const { Notification } = require("../models/notificationSchema");
const { Student } = require("../models/studentSchema");
const { id } = require("date-fns/locale/id");

dotenv.config();

const teacherRegisration = async (req, res) => {
  const { firstname, lastname, email, password, branch } = req.body;

  const existingTeacher = await Teacher.findOne({ email });
  if (existingTeacher) {
    return res
      .status(400)
      .json({ message: "Teacher already exists with this email" });
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
      name: `${newTeacher.firstname} ${newTeacher.lastname}`,
      email: newTeacher.email,
      branch: newTeacher.branch,
      role: newTeacher.role,
    },
  });
};

const teacherLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login data:", email, password);

  try {
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.json({ message: "Teacher not found with this email." });
    }

    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    if (!isPasswordValid) {
      return res.json({ message: "Something Went Wrong" });
    }

    const token = jwt.sign(
      { email: email, role: teacher.role, id: teacher._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

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
    res.status(500).json({ message: "Logout failed", error });
  }
};

const teacherDetails = async (req, res) => {
  try {
    const email = req.user.email;
    // console.log("Fetching teacher details for email:", email);
    const teacher = await Teacher.findOne({ email: email }).select("-password");

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
        phone: teacher.mobile,
      },
    });
  } catch (error) {
    console.error("[PROFILE ERROR]", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const createClass = async (req, res) => {
  const { name, subject } = req.body;
  const teacherId = req.user.id;
  console.log("Creating class with data:", name, subject, teacherId);

  const codeLength = 6;
  var codeString = "";
  for (let i = 0; i < codeLength; i++) {
    codeString += Math.floor(Math.random() * 10).toString();
  }

  const newClass = new Class({
    name,
    subject,
    class_code: codeString,
    teacher: teacherId,
  });

  await newClass.save();

  res.status(201).json({
    message: "Class created successfully.",
    class: {
      id: newClass._id.toString(),
      name: newClass.name,
      subject: newClass.subject,
      class_code: newClass.class_code,
    },
  });
};

const getClasses = async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user.id });
    console.log("Fetching classes...");
    if (!classes || classes.length === 0) {
      return res.status(404).json({ message: "No classes found." });
    }

    res.status(200).json({
      message: "Classes fetched successfully.",
      classes: classes.map((cls) => ({
        id: cls._id.toString(),
        name: cls.name,
        subject: cls.subject,
        class_code: cls.class_code,
      })),
    });
  } catch (error) {
    console.error("[GET CLASSES ERROR]", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteClass = async (req, res) => {
  const classId = req.params.classId;
  console.log("Deleting class with ID:", classId);

  try {
    const deletedClass = await Class.findByIdAndDelete(classId);
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found." });
    } else {
      console.log("Deleted class:", deletedClass);
      res
        .status(200)
        .json({ message: "Class deleted successfully.", class: deletedClass });
    }
  } catch (error) {
    console.error("[DELETE CLASS ERROR]", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const fetchNotification = async (req, res) => {
  const teacherId = req.user.id;

  try {
    const notifications = await Notification.find({ teacherID: teacherId });

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found." });
    }

    res.status(200).json({
      message: "Notifications fetched successfully.",
      notifications: notifications.map((notification) => {
        return {
          id: notification._id.toString(),
          studentName: notification.studentName,
          classname: notification.classname,
          teacherID: notification.teacherID,
          status: notification.status,
          studentID: notification.studentID,
          classID: notification.classID,
        };
      }),
    });
  } catch (error) {
    console.error("[FETCH NOTIFICATION ERROR]", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const approveStudent = async (req, res) => {
  try {
    const { studentID, notificationID, classID } = req.body;

    if (!studentID || !notificationID || !classID) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const updatedClass = await Class.findByIdAndUpdate(
      classID,
      { $addToSet: { students: studentID } },
      { new: true }
    );
    if (!updatedClass) return res.status(404).json({ message: "Class not found." });

    const student = await Student.findById(studentID);
    if (!student) return res.status(404).json({ message: "Student not found." });

    if (!student.classes.includes(classID)) {
      student.classes.push(classID);
      await student.save();
    }

    const deletedNotification = await Notification.findByIdAndDelete(notificationID);
    if (!deletedNotification) return res.status(404).json({ message: "Notification not found." });

    return res.status(200).json({
      class: updatedClass,
      student,
      deletedNotification,
      message: "Student approved and added to class successfully",
    });
  } catch (error) {
    console.error("[APPROVE STUDENT ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


const denyStudent = async (req, res) => {
  const { studentID, notificationID, classID } = req.body;
  const deletedNotification = await Notification.findByIdAndDelete(
    notificationID
  );
  console.log("Denying student with ID:", deletedNotification);

  res.status(200).json({
    deletedNotification: deletedNotification,
    message: "Student denied successfully",
  });
};

const fetchStudentsInClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const classData = await Class.findById(classId).populate("students");
   
    const studentData = classData.students.map((student) => ({
      id: student._id.toString(),
      name: `${student.firstname} ${student.lastname}`,
      email: student.email,
      branch: student.branch,
      phone: student.mobile,
    }));

    res.status(200).json({ students: studentData });
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};
module.exports = {
  teacherLogin,
  teacherRegisration,
  teacherLogout,
  teacherDetails,
  createClass,
  getClasses,
  deleteClass,
  fetchNotification,
  approveStudent,
  denyStudent,
  fetchStudentsInClass,
};
