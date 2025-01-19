const mongoose = require("mongoose"); 

// Shelter schema definition
const shelterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      coordinates: {
        type: [Number],
        required: true,
        index: "2dsphere",
        validate: {
          validator: function (value) {
            return (
              value.length === 2 &&
              typeof value[0] === "number" &&
              value[0] >= -180 &&
              value[0] <= 180 &&
              typeof value[1] === "number" &&
              value[1] >= -90 &&
              value[1] <= 90
            );
          },
          message: "Coordinates must be in the format [longitude, latitude] and valid.",
        },
      },
    },
    type: {
      type: String,
      enum: ["general", "medical", "family", "pet-friendly", "temporary"],
      required: true,
    },
    capacity: { type: Number, required: true },
    availability: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          return value <= this.capacity;
        },
        message: "Availability cannot be greater than capacity.",
      },
    },
    facilities: {
      type: [String],
      required: true,
      enum: ["beds", "food", "water", "medical"],  // Enum without custom validation
    },
    services: {
      type: [String],
      default: [],
      enum: ["first aid", "transport", "shelter assistance"], // Enum without custom validation
    },
    contact: {
      phone: {
        type: String,
        validate: {
          validator: function (value) {
            return /^\d{10}$/.test(value);
          },
          message: "Phone number must be exactly 10 digits.",
        },
      },
      email: {
        type: String,
        validate: {
          validator: function (value) {
            return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
          },
          message: "Email must be in a valid format.",
        },
      },
    },
    photo: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" }, // Reference to uploaded file (photo)
    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    affiliatedDisasters: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Disaster" },
    ],
  },
  { timestamps: true }
);

// Add method to find nearby shelters
shelterSchema.statics.findNearbyShelters = function (longitude, latitude, maxDistance) {
  return this.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance,
      },
    },
  });
};

// Export the Shelter model
module.exports = mongoose.model("Shelter", shelterSchema);
