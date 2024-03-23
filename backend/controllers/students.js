import Student from "../models/Student.js";

export const getStudent = async(req, res) => {
    try{
        const {id} = req.params;
        const student = await Student.findById(id);
        res.status(200).json(student);
    }catch(error) {
        res.status(404).json('Student not found!')
    }
   
};

export const editStudentAccount = async(req, res) => {
    try{
    const {id} = req.params;
    const {password, picturePath} = req.body;
    if(!password || password.length < 8){
        res.status(400).json({message: "Parola trebuie sa contina cel putin 8 caractere!"});
    }
    const updatedStudent = await Student.findByIdAndUpdate(id, {password, picturePath});

    res.status(200).json(updatedStudent);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

//TODO: get toate cursurile la care participa un student, get notele unui student

