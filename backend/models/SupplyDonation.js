const mongoose = require("mongoose");

const supplyDonationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    supplyType: {
      type: String,
      enum: ["Food", "Clothes", "Medicines", "Equipment", "Other"],
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 }, // Quantity of the supply
    dropOffLocation: { type: mongoose.Types.ObjectId, ref: "DropOffLocation" }, // Reference to drop-off location
    message: { type: String },
    photoId: { type: mongoose.Types.ObjectId, ref: "uploads.files" }, // Reference to uploaded photo
    donorId: { type: mongoose.Types.ObjectId, ref: "User" }, // Optional reference to donor
    status: {
      type: String,
      enum: ["Pending", "Received", "In Transit", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupplyDonation", supplyDonationSchema);
