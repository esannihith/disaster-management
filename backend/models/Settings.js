const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notificationPreferences: { type: Boolean, default: true },
    privacyPreferences: { type: String, enum: ["Public", "Team Only", "Private"], default: "Team Only" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
