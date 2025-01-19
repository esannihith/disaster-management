const mongoose = require("mongoose");

const teamCommunicationSchema = new mongoose.Schema(
  {
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: "VolunteerOpportunity", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeamCommunication", teamCommunicationSchema);
