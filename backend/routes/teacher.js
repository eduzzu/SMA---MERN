import express from "express";
import { isCoursesTeacher, isStudentInCourse, isTeachersAccount, verifyToken } from "../middleware/middleware.js";
import { addGrade, deleteGrade, editGrade, editTeacherAccount, getTeacher, getTeacherCourses, getTeacherSchedule } from "../controllers/teachers.js";

const router = express.Router();

router.get("/:id", verifyToken, getTeacher);
router.get("/:id/courses", verifyToken, getTeacherCourses);
router.get("/:id/schedule", verifyToken, getTeacherSchedule);

router.post("/:courseId/:studentId/new", verifyToken, isCoursesTeacher, isStudentInCourse, addGrade);
router.put("/:studentId/:courseId/:gradeId/editGrade", verifyToken, isCoursesTeacher, isStudentInCourse, editGrade);
router.put("/:id/editTeacherAccount", verifyToken, isTeachersAccount, editTeacherAccount);

router.delete("/:studentId/:gradeId/deleteGrade", isCoursesTeacher, isStudentInCourse, verifyToken, deleteGrade);

export default router;