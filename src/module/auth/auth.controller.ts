import { Request, Response } from "express";
import { pool } from "../../config/db";
import { authServices } from "./auth.service";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, phone, password, role } = req.body;

  try {
    const result = await authServices.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0]
    });

    return result;
  } catch (error: any) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};


const signinUser= async (req:Request,res:Response)=>{


  const {email,password}= req.body

  try {
    const result = await authServices.signinUser(email,password)
    
    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password", // পাসওয়ার্ড ভুল হলে এটা দেখাবে
      });
    }

    res.status(200).json({
      success:true,
      message:"Login successful",
      data:result
    })

    return result;
  } 
  
  catch (error) {
    res.status(403).json({
      success:false,
      message: "Signin Failed",
      
    })
  }



}
export const authControllers = {
  registerUser,
  signinUser
};
