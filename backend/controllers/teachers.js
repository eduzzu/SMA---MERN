import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import Grade from "../models/Grade.js";
import Schedule from "../models/Schedule.js";
import { hashPassword } from "./admins.js";
import Course from "../models/Course.js";

export const getTeacher = async(req, res) => {
    try{
        const {id} = req.params;
        const teacher = await Teacher.findById(id);
        res.status(200).json(teacher);
    }catch(error) {
        res.status(404).json('Teacher not found!')
    }
   
};

export const editTeacherAccount = async(req, res) => {
    try{
    const {id} = req.params;
    const {password, picturePath} = req.body;
    if(!password || password.length < 8){
        res.status(400).json({message: "Parola trebuie sa contina cel putin 8 caractere!"});
    }
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, {password: await hashPassword(password), picturePath}, {new: true});

    if (!updatedTeacher) {
        return res.status(404).json({ message: "Profesorul nu a fost găsit." });
    }

    res.status(200).json(updatedTeacher);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

export const addGrade = async(req, res) => {
    try{
        const {courseId, studentId} = req.params;
        const {grade, creditsNumber} = req.body;
        if(!(grade >=1 && grade <=10) || !courseId || (creditsNumber < 2 || creditsNumber >7)){
            return res.status(400).json({message: "Date invalide pentru adaugarea notei."});
        }
         
        const newGrade = new Grade({
            course: courseId,
            grade,
            creditsNumber,
            student: studentId
        });

        const savedGrade = await newGrade.save();
        await updateStudentGrades(await Student.findById(studentId), savedGrade);
        return res.status(201).json(savedGrade);

    } catch(error) {
        return res.status(500).json({message: error.message});
    }
}

const updateStudentGrades = async (studentId, grade) => {
        await Student.findByIdAndUpdate(
            studentId,
            { $push: { grades: grade } },
            { new: true }
        );
}

export const editGrade = async(req, res) => {
    try{
        const {studentId, courseId, gradeId} = req.params;
        const {grade, creditsNumber} = req.body;
        if(!(grade >=1 && grade <=10) || !courseId || (creditsNumber < 2 || creditsNumber > 7)){
            return res.status(400).json({message: "Date invalide pentru editarea notei."});
        }

        const updatedGrade = await Grade.findByIdAndUpdate(gradeId, {student: studentId, courseId, grade: grade, creditsNumber}, {new:true});
        res.status(200).json(updatedGrade);

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const deleteGrade = async (req, res) => {
    try {
        const {studentId, gradeId } = req.params;
        const {courseId} = req.body.course;
        const course = await Course.findById(courseId);
        console.log(course, studentId, gradeId);
        await removeStudentGrades(studentId, gradeId, 'remove');
        await Grade.findByIdAndDelete(gradeId);

        res.status(200).json({ message: "Grade deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const removeStudentGrades = async (studentId, gradeId, action) => {
    try {
        if (action === 'remove') {
            await Student.findOneAndUpdate({ _id: studentId }, { $pull: { grades: gradeId } });
            await Grade.findByIdAndDelete(gradeId);
        }
    } catch (error) {
        throw new Error(`Error updating student grades: ${error.message}`);
    }
}


export const getTeacherCourses = async(req, res) => {
    try{
        const {id} = req.params;
        const teacher = await Teacher.findById(id);
        res.status(200).json(teacher.courses);
    }catch(error){
        res.status(404).json({message: error.message});
    }

}

export const getTeacherSchedule = async(req, res) => {
    try{
        const {id} = req.params;
        const teacher = await Teacher.findById(id);
        res.status(200).json(teacher.schedule);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}
