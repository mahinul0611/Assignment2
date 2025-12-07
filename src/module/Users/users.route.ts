import express, { Request, Response, Router } from "express";
import { userControllers } from "./users.controller";
import auth from "../../middleware/auth";


const router = express.Router()


router.get("/users",auth("admin"), userControllers.getUser);  // Admin Only : 
router.put("/users/:id",auth("admin","customer"),userControllers.updateUser); // Admin or User
router.delete("/users/:id",auth("admin"),userControllers.deleteUser);







export const userRoutes = router;