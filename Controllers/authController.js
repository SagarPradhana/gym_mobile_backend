import jwt from "jsonwebtoken";
import { ENV } from "../Config/env.js";
import User from "../Models/User.js";
import bcrypt from "bcryptjs";

const secretkey = ENV.JWT_SECRET || "mysecretkey";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        ?.status(400)
        ?.json({ message: "Email and password are required" });
    }

    const user = await User?.findOne({ email: email?.toLowerCase() });
    if (!user) {
      return res.status(401)?.json({ message: "Invalid credentials" });
    }

    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword) {
      return res?.status(401)?.json({ message: "Invalid credentials" });
    }

    const token = jwt?.sign(
      { id: user.id, email: user.email, role: user.role },
      secretkey,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    return res?.status(500).json({ message: err.message });
  }
};

export const validToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res?.status(401)?.json({ message: "Authorization header missing" });
    }

    const decoded = jwt.verify(authHeader, secretkey);
    req.user = decoded;
    next();
  } catch (err) {
    return res?.status(401)?.json({ message: "Invalid or expired token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res?.status(403)?.json({ message: "Admin access required" });
  }
  next();
};

export const logoutUser = async (_req, res) => {
  return res?.status(200)?.json({ message: "Logout successful" });
};

export const getCurrentUser = async (req, res) => {

  try {
    const user = await User?.findById(req?.user?.id).select("-password");
    if (!user) {
      return res?.status(404)?.json({ message: "User not found" });
    }

    return res?.status(200)?.json({ data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
});
