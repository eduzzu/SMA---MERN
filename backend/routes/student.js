import express from "express";
import { getStudent, editStudentAccount, getStudentCourses, getStudentSchedule, getStudentGrades } from "../controllers/students.js";
import {isStudentsAccount, verifyToken} from "../middleware/middleware.js";

const router = express.Router();

router.get("/:id", verifyToken, getStudent);
router.get("/:id/courses", verifyToken, getStudentCourses);
router.get("/:id/grades", verifyToken, getStudentGrades);
router.get("/:id/schedule", verifyToken, getStudentSchedule);

router.put("/:id/edit", verifyToken, isStudentsAccount, editStudentAccount);

export default router;