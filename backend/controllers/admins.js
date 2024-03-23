import bcrypt from "bcrypt";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Course from "../models/Course.js";

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
            role,
            studyYear,
            degree
        } = req.body;

        const existingStudent = Student.findOne({email});
        if(existingStudent){
            return res.status(400).json({message: "This student already exists!"});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newStudent = new Student({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            faculty,
            field,
            role,
            studyYear,
            degree
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
            role
        } = req.body;

        const existingTeacher = Teacher.findOne({email});
        if(existingTeacher){
            return res.status(400).json({message: "This teacher already exists!"});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newTeacher = new Teacher({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            faculty,
            field,
            role
    });

        const savedTeacher = await newTeacher.save();
        res.status(200).json(savedTeacher);

    } catch(error) {
        res.status(500).json({message: error.message})
    }
}

/* ADD COURSE */

export const addCourse = async(req, res) => {
    try{
    const {teacherId} = req.params;
    const teacher = await Teacher.findById(teacherId)
    const {name, credits, domain, studyYear, degree} = req.body;
    const newCourse = new Course({
        name,
        teacher,
        credits,
        domain,
        studyYear,
        degree
    });
    const savedCourse = await newCourse.save();
    await Teacher.findByIdAndUpdate(
        teacherId,
        {$push: {courses: savedCourse._id}},
        {new: true}
    );

    res.status(201).json(savedCourse);
} catch(error){
    res.status(500).json({message: error.message});
}
}

/* EDIT COURSE */

export const editCourse = async(req, res) => {
    try{
    const {courseId} = req.params;
    const{teacherId: oldTeacherId, newTeacherId, credits, domain, studyYear, degree} = req.body;
    if(oldTeacherId !== newTeacherId){
        await Teacher.findByIdAndUpdate(
            oldTeacherId,
            { $pull: { courses: courseId } }
        );
        await Teacher.findByIdAndUpdate(
            newTeacherId,
            { $push: { courses: courseId } }
        );
    }
    if((credits < 2 || credits > 7) || !domain ||(studyYear < 1 || studyYear > 4) || !degree){
        return res.status(400).json({message: "Date invalide pentru editarea cursului."});
    }
    const updatedCourse = await Course.findByIdAndUpdate(courseId, {teacher: newTeacherId, credits, domain, studyYear, degree});
    res.status(200).json(updatedCourse);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

/* DELETE COURSE */

export const deleteCourse = async(req, res) => {
    try{
        const {teacherId, courseId} = req.params;
        await Teacher.findByIdAndUpdate(teacherId, {$pull: {courses: courseId}});
        await Course.findByIdAndDelete(courseId);
        res.status(200).json({message: "Course deleted successfully."})
    }catch(error){
        res.status(500).json({message: error.message});
    }
}