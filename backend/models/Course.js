import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    credits: {
        type: Number,
        required: true
    },

    domain: {
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
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
});


const Course = mongoose.model("Course", courseSchema);
export default Course;