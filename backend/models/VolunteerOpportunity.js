const mongoose = require("mongoose");

const volunteerOpportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["Rescue", "Awareness", "Medical Assistance", "Logistics", "Other"],
      required: true,
    },
    location: {
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
      address: { type: String, required: true },
    },
    date: { type: Date, required: true },
    deadline: { type: Date },
    maxVolunteers: { type: Number, required: true },
    currentVolunteers: { type: Number, default: 0 },
    opportunityStatus: {
      type: String,
      enum: ["Open", "Closed", "Cancelled"],
      default: "Open",
    },
    volunteers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "VolunteerProfile" },
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
      },
    ],
    coordinator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assigned coordinator
    photos: [{ type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" }],
    resources: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("VolunteerOpportunity", volunteerOpportunitySchema);
