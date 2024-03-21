import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../models/Student";
import Teacher from "../models/Teacher";

/* REGISTER USER */

export const register = async(req, res) => {
    try{
        const {role} = req.body;
        if(role === "student"){
            return res.redirect("/register/student");
        } else if(role === "teacher"){
            return res.redirect("/register/teacher");
        } else throw new Error('Invalid role specified.')
    } catch(error){
        res.status(500).json({message: error.message});
    }

}

/* REGISTER STUDENT */

export const registerStudent = async(req, res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            faculty,
            field,
            studyYear,
            degree,
            friends
        } = req.body;

        const salt = bcrypt.genSalt();
        passwordHash = await bcrypt.hash(password, salt);

        const newStudent = new Student({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            faculty,
            field,
            studyYear,
            degree,
            friends
        });
         const savedStudent = await newStudent.save();
         res.status(201).json(savedStudent);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

/* REGISTER TEACHER */

export const registerTeacher = async(req, res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            faculty,
            field,
            friends
        } = req.body;

        const salt = bcrypt.genSalt();
        passwordHash = await bcrypt.hash(password, salt);

        const newTeacher = new Teacher({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            faculty,
            field,
            friends
    });

        const savedTeacher = await newTeacher.save();
        res.status(200).json(savedTeacher);

    } catch(error) {
        res.status(500).json({message: error.message})
    }
}

/* LOGIN STUDENT/TEACHER */

export const login = async(req, res) => {
    try{
        const {email, password, role} = req.body;
        if(role === "student"){
            const user = await Student.findOne({email: email, role: role});
        } else if(role === "teacher"){
            user = await Teacher.findOne({email: email, role: role})
        } else throw new Error('Invalid role specified.');
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