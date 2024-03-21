import mongoose from "mongoose";
const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
    },
    lastName: {
        type: String,
        required: true,
        min: 2
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    picturePath: {
        type: String,
        default: "",
      },
    faculty: {
        type: String,
        required: true
    },
    field: {
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    studyYear: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },
    degree: {
        type: String,
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: []
    }],
    grades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Grade",
        default: []
    }],
    schedule: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
        default: []
    }],
    friends: {
        type: Array,
        default: [],
      }
    
}, {timestamps: true});

const Student = mongoose.model('Student', studentSchema);
export default Student;