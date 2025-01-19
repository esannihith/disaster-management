const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    volunteerProfile: { type: mongoose.Schema.Types.ObjectId, ref: "VolunteerProfile", required: true },
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: "VolunteerOpportunity", required: true },
    coordinator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assigned coordinator
    content: { type: String, required: true },
    submissionDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Pending", "Reviewed"], default: "Pending" },
    feedback: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
