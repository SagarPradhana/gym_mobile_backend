import PlanAssignment from "../Models/PlanAssignment.js";

export const getDashboardStats = async (_req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    await refreshExpiredAssignments();

    const [activeMembers, expiredMembers, todayRevenueData] = await Promise.all([
      PlanAssignment.countDocuments({ status: "active" }),
      PlanAssignment.countDocuments({ status: "expired" }),
      PlanAssignment.aggregate([
        {
          $match: {
            createdAt: {
              $gte: todayStart,
              $lt: tomorrowStart,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amountPaid" },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      data: {
        active_members: activeMembers,
        expired_members: expiredMembers,
        today_revenue: todayRevenueData[0]?.total || 0,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getRevenueAnalytics = async (req, res) => {
  try {
    const period = (req.query.period || "weekly").toLowerCase();
    const groupStage = getGroupStage(period);
    const matchStage = getPeriodMatch(period);

    const revenue = await PlanAssignment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupStage,
          total: { $sum: "$amountPaid" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.day": 1 } },
    ]);

    return res.status(200).json({
      data: {
        period,
        analytics: revenue,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const refreshExpiredAssignments = async () => {
  await PlanAssignment.updateMany(
    {
      status: "active",
      endDate: { $lt: new Date() },
    },
    { $set: { status: "expired" } },
  );
};

const getGroupStage = (period) => {
  switch (period) {
    case "daily":
      return {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    case "monthly":
      return {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    case "weekly":
    default:
      return {
        year: { $isoWeekYear: "$createdAt" },
        week: { $isoWeek: "$createdAt" },
      };
  }
};

const getPeriodMatch = (period) => {
  const now = new Date();
  const start = new Date(now);

  if (period === "daily") {
    start.setDate(now.getDate() - 6);
  } else if (period === "monthly") {
    start.setMonth(now.getMonth() - 11);
  } else {
    start.setDate(now.getDate() - 7 * 11);
  }

  return { createdAt: { $gte: start, $lte: now } };
};
