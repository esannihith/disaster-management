const mongoose = require("mongoose");

const dropOffLocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    contact: { type: String }, // Contact number or email
    hours: { type: String }, // Opening hours
    type: {
      type: String,
      enum: ["Warehouse", "Shelter", "Drop-off Point"],
      required: true,
    },
    photoId: { type: mongoose.Types.ObjectId, ref: "uploads.files" }, // Reference to location photo
    coordinatorId: { type: mongoose.Types.ObjectId, ref: "User" }, // Assigned coordinator
  },
  { timestamps: true }
);

module.exports = mongoose.model("DropOffLocation", dropOffLocationSchema);
