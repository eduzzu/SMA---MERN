import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Course from "../models/Course.js";

export const verifyToken = (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) {
            return res.status(403).send('Access denied!');
        } 
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!verified.id || !verified.role) {
            throw new Error('Invalid token payload');
        }
        
        req.user = verified;
        req.role = verified.role;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const isAdmin = (req, res, next) => {
    try{
        if(!req.user || req.user.role !== "Admin"){
            return res.status(403).json({message: "Admin access required."})
        }
        next();
    }catch(error){
        res.status(500).json({message: error.message});
    } 
}

export const isStudentsAccount = async(req, res, next) => {
    try{
        const {id} = req.params;
        const student = await Student.findById(id);
        console.log(student.id, req.user.id);
        if(student.id !== req.user.id){
            return res.status(500).json({message: "You dont have the permission to do that!"});
        }
        next();
    } catch(error) {
        res.status(500).json({message: error.message});
    }
     
}

export const isTeachersAccount = async(req, res, next) => {
    try{
        const {id} = req.params;
        console.log((id));
        const teacher = await Teacher.findById(id);
        console.log(teacher.id, req.user.id);
        if(teacher.id !== req.user.id){
            return res.status(500).json({message: "You dont have the permission to do that!"});
        }
        next();
    } catch(error){
        res.status(500).json({message: error.message});
    }   
}

export const isCoursesTeacher = async(req, res, next) => {
    try{
        const {courseId} = req.params;
        const course = await Course.findById(courseId);
        if (!course.teacher) {
            return res.status(404).json({ message: "Course teacher not found." });
        }
        if(req.user.id !== course.teacher._id.toString()){
            return res.status(500).json({message: "You dont have the permission to do that!"});
        }
        next();
    }catch(error){
        res.status(500).json({message: error.message});
    } 
}

export const isStudentInCourse = async(req, res, next) => {
    try{
        const {courseId, studentId} = req.params;
        const course = await Course.findById(courseId);
        console.log(courseId, studentId);
        const studentExists = course.students.some(student => student._id.toString() === studentId);
        if (!studentExists) {
            return res.status(404).json({ message: "Student not found in course." });
        }
        next();

    }catch(error){
        res.status(500).json({message: error.message});
    }
}