const mongoose = require("mongoose");

const ViewSchema = new mongoose.Schema(
  {
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Allows anonymous users to view
    },
    ipAddress: {
      type: String,
      required: function () {
        return !this.userId;
      }, // Require IP if user is not logged in
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// 🔹 Prevent duplicate views per user/IP
ViewSchema.index({ newsId: 1, userId: 1 }, { unique: true, sparse: true });
ViewSchema.index({ newsId: 1, ipAddress: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("View", ViewSchema);
