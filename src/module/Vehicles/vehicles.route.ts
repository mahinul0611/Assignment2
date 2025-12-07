import express from "express"

import  Router  from "express"
import { vehiclesControllers } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router= express.Router();


router.post("/vehicles",auth("admin"),vehiclesControllers.createVehicle); // Only Admin
router.get("/vehicles",vehiclesControllers.getVehicles);   // Public
router.get("/vehicles/:id",vehiclesControllers.getSingleVehicles); // Public Get Vehicle By ID 
router.put("/vehicles/:id",auth("admin"),vehiclesControllers.updateVehicles); // Update Vehicle only Admin : 
router.delete("/vehicles/:id",auth("admin"),vehiclesControllers.deleteVehicle); // Delete Vehicle Only Admin 

export const vehiclesRoutes =router;