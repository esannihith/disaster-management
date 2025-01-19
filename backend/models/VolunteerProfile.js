const mongoose = require("mongoose");

const VolunteerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to User
    skills: [{ type: String }],
    availability: { type: String }, // e.g., Weekends, Full-Time
    experience: { type: String },
    participationHistory: [
      {
        opportunityId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "VolunteerOpportunity",
        },
        status: { type: String, enum: ["completed", "ongoing", "dropped"], default: "ongoing" },
        feedback: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("VolunteerProfile", VolunteerProfileSchema);
