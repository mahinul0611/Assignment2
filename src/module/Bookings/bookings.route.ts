import express from "express";
import { Router } from "express";
import { bookingControllers } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/bookings",
  auth("admin", "customer"),
  bookingControllers.createBookings
);
router.get(
    "/bookings",
     auth("admin"), 
     bookingControllers.getBookingDetails
    );

router.get(
  "/bookings/:id",
  auth("admin","customer"),
  bookingControllers.getSingleBookingDetails
);
router.put(
  "/bookings/:id",
  auth("admin", "customer"),
  bookingControllers.updateBookings
);

export const bookingRoutes = router;
