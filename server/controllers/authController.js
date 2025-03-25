import userModel from '../models/user.js';
import companyModel from '../models/company.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {z} from 'zod';

const signupHandler = async(req,res)=>{

    //Check all fields are present
    const {username,email,password,role,subrole,companyName} = req.body;
    if(!username || !email || !password || !role || !companyName){
        return res.status(400).json({message: "All fields are required."});
    }

    //Check user already exists
    try{
        const exist = await userModel.findOne({email});
        if(exist){
            console.log("User already exists")
            return res.status(409).json({message: "User already exists"});
        }
    }catch(e){
        console.log("Error in user already exists block : ",e);
        return res.status(500).json({message: "Internal Server error. Try again later."});
    }

    //Check username already exists
    try{
        const user = await userModel.findOne({username});
        if(user){
            console.log("Username is already taken.");
            return res.status(409).json({message: "Username is already taken. Choose someother username."});
        }
    }catch(e){
        console.log("Error in username already exists block : ",e);
        return res.status(500).json({message: "Internal Server error. Try again later."});
    }

    //Input validation
    //Email validation
    const emailSchema = z.string().email({message: "Invalid email format"});
    const validEmail = emailSchema.safeParse(email);
    if(!validEmail.success){
        console.log("Invalid email");
        return res.status(400).json({message: validEmail.error.errors[0].message});
    }

    //Username validation
    const usernameSchema = z.string()
        .min(3,{message: "Name must be atleast 3 characters."})
        .max(50,{message: "Name must be atmost 50 characters."});
    const validUsername = usernameSchema.safeParse(username);
    if(!validUsername.success){
        console.log("Invalid username");
        return res.status(400).json({message: validUsername.error.errors[0].message});
    }

    //Password validation
    const passwordSchema = z.string()
        .min(8, {message: "Password must be atleast 8 characters."})
        .max(50, {message: "Password must be atmost 50 characters."})
        .refine(value => /[A-Z]/.test(value), {message: "Password must contain atleast 1 uppercase letter."})
        .refine(value => /[a-z]/.test(value), {message: "Password must contain atleast 1 lowercase letter."})
        .refine(value => /[0-9]/.test(value), {message: "Password must contain atleast a number from 0-9."})
        .refine(value => /[^a-zA-Z0-9]/.test(value), {message: "Password must contain atleast a special character."});
    const validPassword = passwordSchema.safeParse(password);
    if(!validPassword.success){
        console.log("Invalid password");
        return res.status(400).json({message: validPassword.error.errors[0].message});
    }

    //Role validation
    if(!["Team member", "Scrum master", "Product owner"].includes(role)){
        console.log("Invalid role");
        return res.status(400).json({message: "Please select a valid role."});
    }

    //Subrole validation
    if(subrole && subrole.trim() !== ""){
        const subroleSchema = z.string()
            .min(3,{message: "Subrole must be atleast 3 characters."})
            .max(50,{message: "Subrole must be atmost 50 characters."});
        const validSubrole = subroleSchema.safeParse(subrole);
        if(!validSubrole.success){
            console.log("Invalid subrole");
            return res.status(400).json({message: "Please enter a valid subrole"});
        }
    }

    //Company ObjectId retreival
    let companyId = "";
    try{
        const existingCompany = await companyModel.findOne({name: companyName});
        if(!existingCompany){
            console.log("User doesn't belong to a company.");
            return res.status(400).json({message: "User doesn't belong to a company."});
        }
        companyId = existingCompany._id;
    }catch(e){
        console.log("Error is company id retrieval block : ",e);
        return res.status(500).json({message: "Internal Server Error. Try again later."});
    }

    //Hashing the password
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 11);
        console.log("Hashing with salt done successfully")
    }catch(e){
        console.log("Error in password hashing block");
        return res.status(500).json({message: "Failed to sign up. Please try again later."});
    }
    if (!hashedPassword) {
        return res.status(500).json({ message: "Failed to hash password. Try again later." });
    }

    //Inserting user details in the database
    try{
        await userModel.create({
            username,
            email,
            password: hashedPassword,
            role,
            subrole,
            companyId
        });
        console.log("Inserted successfully in db");
        return res.status(201).json({message: "Signed up successfully"});
    }catch(e){
        console.log("Error inserting details in database")
        return res.status(500).json({message: "Failed to sign up. Please try again later."});
    }

}

const emailVerificationHandler = async(req,res)=>{

}

const signinHandler = async(req,res)=>{

}

const forgotPasswordHandler = async(req,res)=>{

}


export {signupHandler,signinHandler,emailVerificationHandler,forgotPasswordHandler}