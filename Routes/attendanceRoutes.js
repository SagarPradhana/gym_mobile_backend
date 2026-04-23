import express from "express";
import {
  checkInUser,
  checkOutUser,
  getLiveAttendance,
} from "../Controllers/attendanceController.js";
import { requireAdmin, validToken } from "../Controllers/authController.js";

const router = express.Router();

router.use(validToken, requireAdmin);
router.get("/live", getLiveAttendance);
router.post("/check-in", checkInUser);
router.post("/check-out", checkOutUser);

export default router;
