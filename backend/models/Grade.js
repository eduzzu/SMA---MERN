import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },


    grade: {
        type: Number,
        required: true
    },

    creditsNumber: {
        type: Number,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Student',
        required: true,
    },
},{ unique: ["course", "student"]});

const Grade = mongoose.model("Grade", gradeSchema);
export default Grade;