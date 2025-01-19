const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["none", "volunteer", "coordinator", "admin"],
      required: true,
    },
    // Coordinator and admin-specific fields (to be expanded/refined later)
    coordinatorDetails: {
      expertise: { type: String },
      managedOpportunities: [
        { type: mongoose.Schema.Types.ObjectId, ref: "VolunteerOpportunity" },
      ],
    },
    adminDetails: {
      privileges: [{ type: String }],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
