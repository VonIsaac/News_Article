const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likeType: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  { timestamps: true }
);

// 🔹 Allow only ONE like/dislike per user per news article
LikeSchema.index({ newsId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Like", LikeSchema);
