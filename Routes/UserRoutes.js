import express from "express";
import {
  changeUserPassword,
  createUser,
  deleteUser,
  getAllUser,
  toggleUserStatus,
  updateUser,
} from "../Controllers/UserController.js";
import { requireAdmin, validToken } from "../Controllers/authController.js";

const router = express.Router();

router.use(validToken, requireAdmin);
router.get("/", getAllUser);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id/toggle-status", toggleUserStatus);
router.post("/:id/change-password", changeUserPassword);

export default router;
