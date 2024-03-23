import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2
    },
    lastName: {
        type: String,
        required: true,
        min: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    picturePath: {
        type: String,
        default: ""
    },
    faculty: {
        type: String,
        required: true
    },
    field: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "Teacher"
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: []
    }],
    schedule: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
        default: []
    }],
}, {timestamps: true});

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;