import express from "express";

import { isAdmin, verifyToken} from "../middleware/middleware.js";
import { addCourse, deleteCourse, editCourse, registerStudent, registerTeacher } from "../controllers/admins.js";


const router = express.Router();

router.post("/register/student", verifyToken, isAdmin, registerStudent);
router.post("/register/teacher", verifyToken, isAdmin, registerTeacher);
router.post("/newCourse", verifyToken, isAdmin, addCourse);
router.post("/:courseId/:oldTeacherId/editCourse", verifyToken, isAdmin, editCourse);

router.delete("/:courseId/:teacherId/deleteCourse", verifyToken, isAdmin, deleteCourse);

export default router;
