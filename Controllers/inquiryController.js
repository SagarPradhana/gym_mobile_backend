import Inquiry from "../Models/Inquiry.js";

export const getInquiries = async (_req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: inquiries });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const replyToInquiry = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "message is required" });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    inquiry.replies.push({ message });
    inquiry.status = "replied";
    await inquiry.save();

    return res.status(200).json({ message: "Reply added successfully", data: inquiry });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    return res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
