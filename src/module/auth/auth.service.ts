import { pool } from "../../config/db"

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken"
import config from "../../config";

const registerUser= async (payload: Record<string,unknown>)=>{

    const {name,email,phone,password,role} = payload

    const hashedPassword = await bcrypt.hash(password as string,10)


    const result = await pool.query(`
        
        INSERT INTO users(name,email,phone,password,role) VALUES ($1,$2,$3,$4,$5)
        RETURNING *
        
        `,[name,email,phone,hashedPassword,role])
        return result
}

const signinUser = async (email:string,password:string)=>{


    // Valid user kina check ....
    const result= await pool.query(`
        
        
        SELECT * FROM users WHERE email=$1

        
        `,[email])


        if (result.rows.length === 0) {
    throw new Error("User not found"); 
  }

       const user = result.rows[0] 

           const isMatched= await bcrypt.compare(password,user.password);

          if(!isMatched){
            throw new Error("Incorrect password");
        }

         const token = jwt.sign(
            {name: user.name, email:user.email,role:user.role},
            config.jwtSecret as string,
            {
                expiresIn:"10d"
            }

         )

return {token, user};


}

export const authServices ={
    registerUser,
    signinUser
    
}