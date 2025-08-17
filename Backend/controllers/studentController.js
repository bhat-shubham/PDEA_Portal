/* eslint-disable @typescript-eslint/no-require-imports */
const  jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const dotenv = require("dotenv");

dotenv.config();

const {Student} = require('../models/studentSchema');

const studentRegistration = async (req,res)=>{
    const {name, email,mobile,password} = req.body;


    
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

    const student = await Student.findOne({email:email});
    if(!student){
        res.send("Student not found with this email");
    }

    bcrypt.compare(password, student.password  ,(err, ismatch )=>{
        if(err){
            return res.status(500).send({message:"Error comparing password"});    
        }

        if(!ismatch){
            return res.status(400).send({message:"Invalid password"});
        }
    })

    const token = jwt.sign({email: student.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

     // Send response with student details
     console.log("Login successful");
    res.status(200).json({
        message: "Login successful",
        token: token,
        student: {
            name: student.name,
            email: student.email,
            mobile: student.mobile
        }
    });
   
}

const studentLogout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
    });
    res.status(200).json({ message: "student logged out successfully" });
};

module.exports ={studentRegistration, studentLogin , studentLogout}; ;