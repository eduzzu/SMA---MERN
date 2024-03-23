import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Admin from "../models/Admin.js";

/* REGISTER ADMIN */

export const registerAdmin = async(req, res) => {
    try{
        const {firstName, lastName, email, password, role} = req.body;
        const existingAdmin = await Admin.findOne({email});
        if(existingAdmin){
            return res.status(400).json({message: "This admin already exists!"});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            password: passwordHash,
            role
        });

        const savedAdmin = await newAdmin.save();
        res.status(201).json({savedAdmin});

    }catch(error){
        res.status(500).json({message: error.message})
    }
}


/* LOGIN STUDENT/TEACHER/ADMIN */

export const login = async(req, res) => {
    try{
        let user;
        const {email, password} = req.body;
        if(email.endsWith('student.edu')){
            user = await Student.findOne({email: email});
        } else if(email.endsWith('teacher.edu')){
            user = await Teacher.findOne({email: email}); 
        } else if(email.endsWith('admin.edu')){
            user = await Admin.findOne({email: email});
        }
        if(!user) return res.status(400).json({msg: "User does not exist."});
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({msg: "Invalid credentials."});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({token, user});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}