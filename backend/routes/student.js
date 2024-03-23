import express from "express";
import { getStudent, editStudentAccount } from "../controllers/students.js";
import {verifyToken} from "../middleware/middleware.js";

const router = express.Router();

router.get("/:id", verifyToken, getStudent);
router.put("/:id/edit", verifyToken, editStudentAccount);

export default router;