import express from "express";
import {
  assignPlanToUser,
  createPlan,
  getPlans,
  getUserPlans
} from "../Controllers/planController.js";
import { requireAdmin, validToken } from "../Controllers/authController.js";

const router = express.Router();

router.use(validToken);
router.get("/", getPlans);
router.post("/", createPlan);
router.post("/assign", assignPlanToUser);
router.get("/:userId", getUserPlans);

export default router;
