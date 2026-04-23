import express from "express";
import {
  deleteInquiry,
  getInquiries,
  replyToInquiry,
} from "../Controllers/inquiryController.js";
import { requireAdmin, validToken } from "../Controllers/authController.js";

const router = express.Router();

router.use(validToken, requireAdmin);
router.get("/", getInquiries);
router.post("/:id/reply", replyToInquiry);
router.delete("/:id", deleteInquiry);

export default router;
