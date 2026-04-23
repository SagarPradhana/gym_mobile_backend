import express from "express";
import {
  getDashboardStats,
  getRevenueAnalytics,
} from "../Controllers/adminController.js";
import { requireAdmin, validToken } from "../Controllers/authController.js";

const router = express.Router();

router.use(validToken, requireAdmin);
router.get("/dashboard-stats", getDashboardStats);
router.get("/revenue-analytics", getRevenueAnalytics);

export default router;
