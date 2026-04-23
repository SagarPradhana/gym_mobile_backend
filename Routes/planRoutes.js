import express from "express";
import {
  assignPlanToUser,
  createPlan,
  getPlans,
} from "../Controllers/planController.js";
import { requireAdmin, validToken } from "../Controllers/authController.js";

const router = express.Router();

router.use(validToken, requireAdmin);
router.get("/", getPlans);
router.post("/", createPlan);
router.post("/assign", assignPlanToUser);

export default router;
