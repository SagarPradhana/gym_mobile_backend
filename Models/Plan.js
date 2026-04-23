import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration_months: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Plan", planSchema);
