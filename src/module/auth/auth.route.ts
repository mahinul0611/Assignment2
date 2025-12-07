import express, { Request, Response, Router } from "express";
import { pool } from "../../config/db";
import { authControllers } from "./auth.controller";
import auth from "../../middleware/auth";


const router= express.Router()


router.post("/signup",authControllers.registerUser)
router.post("/signin",authControllers.signinUser)




export const authRoutes= router;
