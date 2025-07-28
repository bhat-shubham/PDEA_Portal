const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
const { Admin } = require('../models/studentSchema');

const {Teacher} = require('../models/studentSchema');


dotenv.config();

// Admin Registration
const adminRegistration = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if admin already exists
        const isAdminExist = await Admin.findOne({ email });
        if (isAdminExist) {
            return res.status(400).send("Admin already exists with this email");
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save new admin
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword
        });

        await newAdmin.save();

        res.status(200).json({
            message: "Admin registered successfully",
            admin: {
                name: newAdmin.name,
                email: newAdmin.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// Admin Login
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).send("Admin not found with this email");
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).send("Invalid password");
        }

        const token = jwt.sign({ email:email }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            message: "Admin logged in successfully",
            token: token,
            admin: {
                name: admin.name,
                email: admin.email
            }
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
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
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
            name: t.name,
            email: t.email,
            department: t.department,
            mobile: t.mobile
        }));

        res.status(200).json({
            message: "Teacher list fetched successfully",
            teachers: formattedTeachers
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");       
    }
};



module.exports = { adminLogin, adminRegistration ,adminLogout, teacherlist};
