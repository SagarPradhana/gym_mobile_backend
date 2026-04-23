import express from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  validToken,
} from "../Controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", validToken, logoutUser);
router.get("/me", validToken, getCurrentUser);

export default router;
