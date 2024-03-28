import bcrypt from "bcrypt";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Course from "../models/Course.js";

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const registerStudent = async (req, res) => {
    try {
        const studentData = extractStudentData(req.body);
        const existingStudent = await checkExistingStudent(studentData.email);
        if (existingStudent) {
            return res.status(400).json({ message: "This student already exists!" });
        }

        const hashedPassword = await hashPassword(studentData.password);
        const savedStudent = await createNewStudent(studentData, hashedPassword);
        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const extractStudentData = (data) => {
    return {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        picturePath: data.picturePath,
        faculty: data.faculty,
        field: data.field,
        role: data.role,
        studyYear: data.studyYear,
        degree: data.degree
    };
}

const checkExistingStudent = async (email) => {
    return await Student.findOne({ email });
}

const createNewStudent = async (studentData, hashedPassword) => {
    const newStudent = new Student({
        ...studentData,
        password: hashedPassword
    });
    return await newStudent.save();
}

export const registerTeacher = async (req, res) => {
    try {
        const teacherData = extractTeacherData(req.body);
        const existingTeacher = await checkExistingTeacher(teacherData.email);
        if (existingTeacher) {
            return res.status(400).json({ message: "This teacher already exists!" });
        }

        const hashedPassword = await hashPassword(teacherData.password);
        const savedTeacher = await createNewTeacher(teacherData, hashedPassword);
        res.status(201).json(savedTeacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const extractTeacherData = (data) => {
    return {
        firstName: data.firstName,
        lastName: data.lastName, 
        email: data.email, 
        password: data.password, 
        picturePath: data.picturePath,
        faculty: data.faculty, 
        field: data.field,
        role: data.role
    };
}

const checkExistingTeacher = async (email) => {
    return await Teacher.findOne({ email });
}

const createNewTeacher = async (teacherData, hashedPassword) => {
    const newTeacher = new Teacher({
        ...teacherData,
        password: hashedPassword
    });
    return await newTeacher.save();
}

export const addCourse = async (req, res) => {
    try {
        const courseData = extractCourseData(req.body);

        const foundTeacher = await findTeacher(courseData.teacher);
        if (!foundTeacher) {
            return res.status(400).json({ message: "Teacher not found!" });
        }

        const newCourse = await createNewCourse(courseData, foundTeacher);

        await updateTeacherCourses(courseData.teacher, newCourse._id, "add");

        await updateStudentsCourses(courseData.students, newCourse._id);

        res.status(201).json(newCourse);
    } catch (error) {
       return res.status(500).json({ message: error.message });
    }
}

const extractCourseData = (data) => {
    return {
        name: data.name,
        teacher: data.teacher,
        credits: data.credits,
        domain: data.domain,
        studyYear: data.studyYear,
        degree: data.degree,
        students: data.students
    };
}

const findTeacher = async (teacherId) => {
    return await Teacher.findById(teacherId);
}

const createNewCourse = async (courseData, teacher) => {
    const newCourse = new Course({
        name: courseData.name,
        teacher: teacher._id,
        credits: courseData.credits,
        domain: courseData.domain,
        studyYear: courseData.studyYear,
        degree: courseData.degree,
        students: courseData.students
    });
    return await newCourse.save();
}

const updateStudentsCourses = async (studentIds, courseId) => {
    for (const studentId of studentIds) {
        await Student.findByIdAndUpdate(
            studentId,
            { $push: { courses: courseId } },
            { new: true }
        );
    }
}

export const editCourse = async (req, res) => {
    try {
        const { courseId, oldTeacherId } = req.params;
        const { teacher, credits, domain, studyYear, degree } = req.body;
        const newTeacherId = teacher;

        if (oldTeacherId !== newTeacherId) {
            await updateTeacherCourses(oldTeacherId, courseId, 'remove');
            await updateTeacherCourses(newTeacherId, courseId, 'add');
        }
        if ((credits < 2 || credits > 7) || !domain || (studyYear < 1 || studyYear > 4) || !degree) {
            return res.status(400).json({ message: "Invalid data for course editing." });
        }

        const updatedCourse = await Course.findByIdAndUpdate(courseId, { teacher: newTeacherId, credits, domain, studyYear, degree }, { new: true });
        res.status(200).json(updatedCourse);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateTeacherCourses = async (teacherId, courseId, action) => {
    try {
        const updateQuery = action === 'add' ? { $addToSet: { courses: courseId } } : { $pull: { courses: courseId } };
        await Teacher.findOneAndUpdate({ _id: teacherId }, updateQuery);
        if (action === 'remove') {
            await Course.deleteOne({ _id: courseId, teacher: teacherId });
        }
        console.log(action);
    } catch (error) {
        throw new Error(`Error updating teacher courses: ${error.message}`);
    }
}

export const deleteCourse = async (req, res) => {
    try {
        const { courseId, teacherId } = req.params;
        await updateTeacherCourses(teacherId, courseId, 'remove');
        await Course.findByIdAndDelete(courseId);
        await removeStudentCourses(courseId, 'remove');

        res.status(200).json({ message: "Course deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const removeStudentCourses = async (courseId, action) => {
    try {
        await Student.updateMany({ courses: courseId }, { $pull: { courses: courseId } });
    } catch (error) {
        throw new Error(`Error updating student courses: ${error.message}`);
    }
}

