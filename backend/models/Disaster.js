const mongoose = require("mongoose");

const { Schema } = mongoose;

const disasterSchema = new Schema(
  {
    name:{
      type: String,
      default: null
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Earthquake",
        "Flood",
        "Hurricane",
        "Tornado",
        "Wildfire",
        "Landslide",
        "Volcanic Eruption",
        "Tsunami",
        "Other",
      ],
    },
    location: {
      address: { type: String, required: true },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (value) {
            return (
              value.length === 2 &&
              typeof value[0] === "number" &&
              value[0] >= -90 &&
              value[0] <= 90 &&
              typeof value[1] === "number" &&
              value[1] >= -180 &&
              value[1] <= 180
            );
          },
          message:
            "Coordinates must be in the format [latitude, longitude] and valid.",
        },
      },
    },
    dateTime: { type: Date, required: true },
    description: { type: String, required: true },
    impactSummary: { type: String },
    redZoneRange: { type: Number, required: true },
    severity: {
      type: String,
      required: true,
      enum: ["Severe", "Moderate", "Low", "High"],
    },
    casualties: { type: Number, default: 0 },
    affectedAreas: { type: [String], default: [] },
    shelters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shelter", // Reference to the Shelter model
      },
    ],
    hospitals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital", // Reference to the Hospital model
      },
    ],
    statusUpdates: [
      {
        dateTime: { type: Date, default: Date.now },
        message: { type: String, required: true },
      },
    ],
    emergencyContacts: [
      {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
      },
    ],
    media: {
      images: [{ type: String }], // URLs for images
      videos: [{ type: String }], // URLs for videos
    },
    endDate: { type: Date }, // For marking disaster resolution
    status: {
      type: String,
      enum: ["Ongoing", "Resolved", "Under Recovery", "New"],
      default: "New",
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt
);

const Disaster = mongoose.model("Disaster", disasterSchema);

module.exports = Disaster;
