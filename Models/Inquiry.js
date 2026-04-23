import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    replies: [
      {
        message: {
          type: String,
          required: true,
          trim: true,
        },
        repliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["open", "replied"],
      default: "open",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Inquiry", inquirySchema);
