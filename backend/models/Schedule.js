import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    dayOfWeek: {
        type: String,
        required: true,
    },
    startTime:{
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.ObjectId,
        ref: 'Course',
        required: true
    },
    classroom: {
        type: String,
        required: true
    },
    teacher:{
        type: mongoose.ObjectId,
        ref: 'Teacher',
        required: true
    }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;