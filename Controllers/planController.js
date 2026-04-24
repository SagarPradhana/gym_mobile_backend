import Plan from "../Models/Plan.js";
import PlanAssignment from "../Models/PlanAssignment.js";
import User from "../Models/User.js";

export const getPlans = async (_req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: plans });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const createPlan = async (req, res) => {
  try {
    const { title, price, duration_months } = req.body;
    if (!title || price === undefined || !duration_months) {
      return res.status(400).json({ message: "title, price and duration_months are required" });
    }

    const plan = await Plan.create({ title, price, duration_months });
    return res.status(201).json({ message: "Plan created successfully", data: plan });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const assignPlanToUser = async (req, res) => {
  try {
    const { user_id, plan_id, startDate, endDate } = req.body;
    if (!user_id || !plan_id) {
      return res.status(400).json({ message: "user_id and plan_id are required" });
    }

    const [user, plan] = await Promise.all([
      User.findById(user_id),
      Plan.findById(plan_id),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await PlanAssignment.updateMany(
      { user: user_id, status: "active" },
      { $set: { status: "expired" } },
    );

    const assignment = await PlanAssignment.create({
      user: user_id,
      plan: plan_id,
      amountPaid: plan.price,
      startDate,
      endDate,
      status: "active",
    });

    const populatedAssignment = await assignment.populate([
      { path: "user", select: "name email role status" },
      { path: "plan" },
    ]);

    return res.status(201).json({
      message: "Plan assigned successfully",
      data: populatedAssignment,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserPlans = async (req, res) => {
  try {
    const userId = req.params.userId;
    const assignments = await PlanAssignment.find({ user: userId })
      .populate("plan").populate({ path: "user", select: "name email role status" })
      .sort({ createdAt: -1 });

    return res.status(200).json({ data: assignments });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

