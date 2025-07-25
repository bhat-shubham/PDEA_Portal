const  jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");

dotenv.config();

const {Student} = require('../models/studentSchema');

const studentRegistration = async (req,res)=>{
    const {name, email,mobile,password} = req.body;


    // Check if the student already exists
    const isStudentExist  = await Student.findOne({email: email});

    if(isStudentExist){
        return res.status(400).send("Student already exists with this email");
    }

    bcrypt.genSalt(10, async (err,salt)=>{
        if(err){
            return res.status(500).send("Error generating salt");
        }
        bcrypt.hash(password, salt, async (err,hash)=>{
            if(err){
                return res.status(500).send("Error hashing password");
            }
            // Save the student with hashed password
            const newStudent = new Student({
                name,
                email,
                mobile,
                password: hash
            });
            await newStudent.save();
            
        });
    })

    res.status(200).json({
        message: "Student registered successfully",
        student: {
            name: name,
            email: email,
            mobile: mobile}
})    
    

}


const studentLogin = async (req, res) => {
    const {email, password} = req.body;
    console.log({email, password});
    // Check if the student exists
    const student = await Student.findOne({email:email});
    if(!student){
        res.send("Student not found with this email");
    }

    bcrypt.compare(password, student.password  ,(err, ismatch )=>{
        if(err){
            return res.status(500).send("Error comparing password");    
        }

        if(!ismatch){
            return res.status(400).send("Invalid password");
        }
    })

    const token = jwt.sign({email: student.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.status(200).json({
        message: "Login successful",
        token: token,
        student: {
            name: student.name,
            email: student.email,
            mobile: student.mobile
        }
    });
    // res.send("Login successful");
}

module.exports ={studentRegistration, studentLogin}; ;