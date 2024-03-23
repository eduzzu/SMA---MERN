import Teacher from "../models/Teacher";
import Student from "../models/Student";
import Grade from "../models/Grade";

export const getTeacher = async(req, res) => {
    try{
        const {id} = req.params;
        const teacher = await Teacher.findById(id);
        res.status(200).json(teacher);
    }catch(error) {
        res.status(404).json('Teacher not found!')
    }
   
};

export const editTeacherAccount = async(req, res) => {
    try{
    const {id} = req.params;
    const {password, picturePath} = req.body;
    if(!password || password.length < 8){
        res.status(400).json({message: "Parola trebuie sa contina cel putin 8 caractere!"});
    }
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, {password, picturePath});

    res.status(200).json(updatedTeacher);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

export const addGrades = async(req, res) => {
    try{
        const {studentId} = req.params;
        const {courseId, grade, creditsNumber} = req.body;
        if(!(grade >=1 && grade <=10) || !courseId || (creditsNumber < 2 || creditsNumber >7)){
            return res.status(400).json({message: "Date invalide pentru adaugarea notei."});
        }
         
        const newGrade = new Grade({
            course: courseId,
            grade,
            creditsNumber,
            student: studentId
        });

        const savedGrade = await newGrade.save();
        res.status(201).json(savedGrade);

    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

export const editGrade = async(req, res) => {
    try{
        const {gradeId} = req.params;
        const {studentId, courseId, grade, creditsNumber} = req.body;
        if(!(grade >=1 && grade <=10) || !courseId || (creditsNumber < 2 || creditsNumber > 7)){
            return res.status(400).json({message: "Date invalide pentru editarea notei."});
        }

        const updatedGrade = await Grade.findByIdAndUpdate(gradeId, {student: studentId, courseId, grade, creditsNumber});
        res.status(200).json(updatedGrade);

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const deleteGrade = async(req, res) => {
    try{
        const {id, gradeId} = req.params;
        await Student.findByIdAndUpdate(id, {$pull: {grades: gradeId}});
        await Grade.findByIdAndDelete(gradeId);
        res.status(200).json({message: "Grade deleted successfully."});
    }catch(error) {
        res.status(500).json({message: error.message});
    }
}
