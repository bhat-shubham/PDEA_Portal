/* eslint-disable @typescript-eslint/no-require-imports */
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const { Student } = require("../models/studentSchema");
const { Class } = require("../models/classSchema");
const { Notification } = require("../models/notificationSchema");
const { Attendence } = require("../models/attendenceSchema");
const mongoose = require("mongoose");

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

const studentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await Attendence.aggregate([
      {
        $match: { studentId: new mongoose.Types.ObjectId(studentId) },
      },
      {
        $group: {
          _id: "$classId",
          total: { $sum: 1 },
          attended: {
            $sum: {
              $cond: [{ $eq: ["$status", "present"] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "classes",
          localField: "_id",
          foreignField: "_id",
          as: "class",
        },
      },
      { $unwind: "$class" },
      {
        $project: {
          classId: "$_id",
          name: "$class.subject",
          className: "$class.name",
          total: 1,
          attended: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: "Attendance fetched successfully",
      subjects: result.map((r) => ({
        name: r.name,
        attended: r.attended,
        total: r.total,
      })),
    });
  } catch (error) {
    console.error("[STUDENT ATTENDANCE ERROR]", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    console.log("student",student)
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
      { email: email, id: student.id, role: student.role },
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
        classes: student.classes,
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
    const student = await Student.findOne({ email: email }).select("-password")
    .populate({
      path:"classes",
      select: "name subject class_code",
      populate:{
        path:"teacher",
        select:"firstname lastname email branch"
      }
    })
    ;
    // console.log(teacher);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    const classes = student.classes.map((cls) => ({
      id: cls._id.toString(),
      name: cls.name,
      subject: cls.subject,
      class_code: cls.class_code,
      teacher: cls.teacher
        ? {
            id: cls.teacher._id.toString(),
            name: `${cls.teacher.firstname} ${cls.teacher.lastname}`,
            email: cls.teacher.email,
            branch: cls.teacher.branch,
          }
        : null,
    }));

    res.status(200).json({
      message: "Student profile fetched successfully.",
      student: {
        id: student._id,
        firstname: student.firstname,
        lastname: student.lastname,
        email: student.email,
        branch: student.branch,
        phone: student.mobile,
        classes
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
    // const subject = classResult.subject;

    console.log("Class code:", classCode);
    console.log("Student email:", studentEmail);
    // console.log(req);

    const classResult = await Class.findOne({ class_code: classCode });
    console.log("Class result:", classResult.subject);
    const student = await Student.findOne({ email: studentEmail });

    if (!classResult || !student) {
      return res.status(404).json({ message: "Class or student not found" });
    }
    
    const existingNotification = await Notification.findOne({
      studentID: student._id.toString(),
      classID: classResult._id.toString(),
      subject: classResult.subject,
      status: "pending"
    });

    if (existingNotification) {
      return res.status(400).json({ message: "You have already sent a join request for this class" });
    }

    const notification = new Notification({
      studentName: `${student.firstname} ${student.lastname}`,
      classname: classResult.name,
      subject: classResult.subject,
      teacherID: classResult.teacher.toString(),
      studentID: student._id.toString(),
      status: "pending",
      classID: classResult._id.toString(),
    });

    console.log("Notification:", notification);
    await notification.save();

    const io = req.app.get("io");
    // console.log(classResult.teacher.toString());
    io.to(classResult.teacher.toString()).emit("new_notification", {
      ...notification.toObject(),
      id: notification._id.toString(),
    });

    return res.status(200).json({
      message: "Join request sent successfully",
      notification: {
        ...notification.toObject(),
        id: notification._id.toString(),
      },
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
  studentAttendance,
};
