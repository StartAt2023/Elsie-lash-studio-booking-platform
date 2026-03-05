import { Router } from "express";
import {
  getBookings,
  getBooking,
  createBookingHandler,
  updateBookingHandler,
  deleteBookingHandler,
} from "../controllers/bookingController.js";

const router = Router();

router.get("/", getBookings);
router.get("/:id", getBooking);
router.post("/", createBookingHandler);
router.put("/:id", updateBookingHandler);
router.delete("/:id", deleteBookingHandler);

export default router;

