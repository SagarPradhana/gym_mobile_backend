import Attendance from "../Models/Attendance.js";
import User from "../Models/User.js";

export const getLiveAttendance = async (_req, res) => {
  try {
    const records = await Attendance.find({ status: "inside", checkOutTime: null })
      .populate("user", "name email role status phone")
      .sort({ checkInTime: -1 });

    return res.status(200).json({ data: records });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const checkInUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const openAttendance = await Attendance.findOne({
      user: user_id,
      status: "inside",
      checkOutTime: null,
    });
    if (openAttendance) {
      return res.status(409).json({ message: "User is already checked in" });
    }

    const attendance = await Attendance.create({ user: user_id });
    return res.status(201).json({ message: "Check-in successful", data: attendance });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const checkOutUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const attendance = await Attendance.findOne({
      user: user_id,
      status: "inside",
      checkOutTime: null,
    }).sort({ checkInTime: -1 });

    if (!attendance) {
      return res.status(404).json({ message: "No active attendance record found" });
    }

    attendance.checkOutTime = new Date();
    attendance.status = "completed";
    await attendance.save();

    return res.status(200).json({ message: "Check-out successful", data: attendance });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
