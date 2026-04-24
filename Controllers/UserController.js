import bcrypt from "bcryptjs";
import User from "../Models/User.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, username } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "name, email, password and role are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone,
      address,
    });

    return res.status(201).json({
      message: "User created successfully",
      data: sanitizeUser(user),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const filters = {};

    if (req.query.role) {
      filters.role = req.query.role.toLowerCase();
    }
    if (req.query.status) {
      filters.status = req.query.status.toLowerCase();
    }

    const users = await User.find(filters).select("-password").sort({ createdAt: -1 });
    return res.status(200).json({
      data: users ?? [],
      message: "Users fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const allowedFields = ["name", "phone", "address", "email", "role", "username"];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key, value]) => allowedFields.includes(key) && value !== undefined),
    );

    if (updates.email) {
      updates.email = updates.email.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully", data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();

    return res.status(200).json({
      message: "User status updated successfully",
      data: sanitizeUser(user),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { new_password } = req.body;
    if (!new_password) {
      return res.status(400).json({ message: "new_password is required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(new_password, salt);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  status: user.status,
});
