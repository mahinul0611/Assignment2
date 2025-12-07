import express, { NextFunction, Request, Response } from "express";

import initDB from "./config/db";
import { userRoutes } from "./module/Users/users.route";
import { authRoutes } from "./module/auth/auth.route";
import { vehiclesRoutes } from "./module/Vehicles/vehicles.route";
import { bookingRoutes } from "./module/Bookings/bookings.route";
import logger from "./middleware/logger";

const app = express();


//Body Parser :
app.use(express.json());


app.get("/", logger, (req: Request, res: Response) => {
  res.send("Welcome to Vehicle Rental System");
});
// initializing Database :

initDB();

app.use("/api/v1", userRoutes);
app.use("/api/v1", vehiclesRoutes);
app.use("/api/v1", bookingRoutes);
app.use("/api/v1/auth/", authRoutes);


app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.path,
  });
});


export default app;
