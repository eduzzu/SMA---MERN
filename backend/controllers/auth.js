import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Admin from "../models/Admin.js";
import { hashPassword } from "./admins.js";

export const registerAdmin = async (req, res) => {
    try {
        const adminData = extractAdminData(req.body);
        const adminExists = await checkExistingAdmin(adminData.email);
        if (adminExists) {
            return res.status(400).json({ message: "This admin already exists!" });
        }

        const hashedPassword = await hashPassword(adminData.password);
        const savedAdmin = await createNewAdmin(adminData, hashedPassword);
        res.status(201).json(savedAdmin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const checkExistingAdmin = async (email) => {
    try {
        const existingAdmin = await Admin.findOne({ email });
        return !!existingAdmin;
    } catch (error) {
        throw new Error(`Error checking existing admin: ${error.message}`);
    }

}

const extractAdminData = (data) => {
    try {
        return {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password
        }
    } catch (error) {
        throw new Error(`Couldn't extract admin data: ${error.message}`);
    }

}

const createNewAdmin = async (adminData, hashedPassword) => {
    try {
        const newAdmin = new Admin({
            ...adminData,
            password: hashedPassword
        });
        return await newAdmin.save();
    } catch (error) {
        throw new Error(`Error creating new Admin: ${error.message}`);
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getUserRole(email);
        const isPasswordCorrect = await isPasswordMatching(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: `Invalid credentials.` })
        }
        const token = generateJWTToken(user);
        return res.status(200).json({ token, user })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserRole = async (email) => {
    let user;
    try {
        switch (true) {
            case email.endsWith('student.edu'):
                user = await Student.findOne({ email });
                break;
            case email.endsWith('teacher.edu'):
                user = await Teacher.findOne({ email });
                break;
            case email.endsWith('admin.edu'):
                user = await Admin.findOne({ email });
                break;
            default: throw new Error(`Invalid role.`);
        }
    }
    catch (error) {
        throw new Error(`Invalid credentials.`);
    }

    if (!user) {
        throw new Error(`User does not exist.`)
    }
    return user;

}

const isPasswordMatching = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error(`Couldn't fetch the password.`);
    }
}

const generateJWTToken = (user) => {
    try {
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        return token;
    } catch (error) {
        throw new Error(`Couldn't generate a token. : ${error.message}`);
    }
}
