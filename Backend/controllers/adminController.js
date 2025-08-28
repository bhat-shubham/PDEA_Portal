/* eslint-disable @typescript-eslint/no-require-imports */
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { Admin } = require("../models/adminSchema");

const { Teacher } = require("../models/teacherSchema");
const Notices = require("../models/noticeSchema");

dotenv.config();

const adminRegistration = async (req, res) => {
  console.log("regiatration started");
  const { firstname, lastname, email, password, phone } = req.body;
  console.log(req.body);

  try {
    const isAdminExist = await Admin.findOne({ email });
    if (isAdminExist) {
      return res.status(400).json({
        message: "Admin already exists with this email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
        firstname: newAdmin.firstname,
        lastname: newAdmin.lastname,
        email: newAdmin.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    console.log("Admin found:", admin);
    if (!admin) {
      res.status(404).json({ message: "Invalid Username Or Password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Something Went Wrong" });
    }

    const token = jwt.sign(
      { email: email, role: admin.role, id: admin._id },
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

    res.status(200).json({
      message: "Admin logged in successfully",
      token: token,
      admin: {
        firstname: admin.firstname,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const adminLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Admin logged out successfully" });
};

const teacherlist = async (req, res) => {
  try {
    console.log("Fetching teacher list...");
    const teachers = await Teacher.find({ role: "teacher" }).select(
      "-password"
    );

    if (teachers.length === 0) {
      return res.status(404).json({ message: "No teachers found" });
    }

    const formattedTeachers = teachers.map((t) => ({
      firstname: t.firstname,
      lastname: t.lastname,
      email: t.email,
      branch: t.branch,
      id: t._id,
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

const adminProfile = async (req, res) => {
  const email = req.user.email;
  console.log("Fetching admin profile for email:", email);
  try {
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({
      message: "Admin profile fetched successfully",
      admin: {
        firstname: admin.firstname,
        lastname: admin.lastname,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const notices = async (req, res) => {
  console.log("notices");
  const { title, content, type } = req.body;
  const adminID = req.user.id;
  const io = req.app.get("io");

  try {
    const newNotice = new Notices({
      title,
      content,
      type,
      admin: adminID,
    });
    const savedNotice = await newNotice.save();
    const noticeObj = savedNotice.toObject();
    noticeObj.id = noticeObj._id;

    io.emit("newNotice", newNotice);
    res.status(200).json({
      message: "Notice added successfully",
      notice: {
        id: noticeObj.id,
        title: noticeObj.title,
        content: noticeObj.content,
        type: noticeObj.type,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const fetchNotices = async (req, res) => {
  const notices = await Notices.find();

  if (!notices) {
    return res.status(404).json({ message: "No notices found" });
  }

  const notice = notices.map((notice) => ({
    id: notice._id,
    title: notice.title,
    content: notice.content,
    type: notice.type,
    createdAt: notice.createdAt,
  }));

  res.status(200).json({
    message: "Notices fetched successfully",
    notices: notice,
  });
};

const deleteNotice = async (req, res) => {
  const noticeId = req.params.noticeId;
  try {
    const deletedNotice = await Notices.findByIdAndDelete(noticeId);
    if (!deletedNotice) {
      return res.status(404).json({ message: "Notice not found." });
    } else {
      console.log("Deleted notice:", deletedNotice);
      res.status(200).json({
        message: "Notice deleted successfully.",
        notice: deletedNotice,
      });
    }
  } catch (error) {
    console.error("[DELETE NOTICE ERROR]", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  adminLogin,
  adminRegistration,
  adminLogout,
  teacherlist,
  adminProfile,
  notices,
  fetchNotices,
  deleteNotice,
};
