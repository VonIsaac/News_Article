const mongoose = require("mongoose");

const ViewSchema = new mongoose.Schema(
  {
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
      required: true,
    },
    ipAddress: {
      type: String,
      required: true, // Store the visitor's IP to track unique views if needed
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// 🔹 Prevent duplicate views per user/IP



module.exports = mongoose.model("View", ViewSchema);
