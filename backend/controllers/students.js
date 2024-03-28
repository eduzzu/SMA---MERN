import Student from "../models/Student.js";
import Course from "../models/Course.js";
import { hashPassword } from "./admins.js";

export const getStudent = async(req, res) => {
    try{
        const {id} = req.params;
        const student = await Student.findById(id);
        res.status(200).json(student);
    }catch(error) {
        res.status(404).json('Student not found!')
    }
   
};

export const editStudentAccount = async(req, res) => {
    try{
    const {id} = req.params;
    const {password, picturePath} = req.body;
    if(!password || password.length < 8){
       return res.status(400).json({message: "Parola trebuie sa contina cel putin 8 caractere!"});
    }
    const updatedStudent = await Student.findByIdAndUpdate(id, {password: await hashPassword(password), picturePath}, {new: true});

    if (!updatedStudent) {
        return res.status(404).json({ message: "Studentul nu a fost găsit." });
    }

    res.status(200).json(updatedStudent);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};


export const getStudentCourses = async(req, res) => {
    try{
        const {id} = req.params;
        const student = await Student.findById(id);
        res.status(200).json(student.courses);
    }catch(error){
        res.status(404).json({message: error.message});
    }

}

export const getStudentGrades = async(req, res) => {
    try{
        const {id} = req.params;
        const student = await Student.findById(id);
        res.status(200).json(student.grades);
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const getStudentSchedule = async(req, res) => {
    try{
        const {id} = req.params;
        const student = await Student.findById(id);
        res.status(200).json(student.schedule);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

