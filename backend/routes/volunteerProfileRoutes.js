const express = require("express");
const router = express.Router();
const VolunteerProfile = require("../models/VolunteerProfile");
const User = require("../models/User");

// Middleware to find user by email
const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// Create a new Volunteer Profile
router.post("/", async (req, res) => {
  try {
    const { email, skills, availability, experience } = req.body;
    const user = await findUserByEmail(email);

    const newProfile = new VolunteerProfile({
      user: user._id,
      skills,
      availability,
      experience,
    });

    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Volunteer Profile by Email
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await findUserByEmail(email);

    const profile = await VolunteerProfile.findOne({ user: user._id }).populate("user");
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Volunteer Profile (Partial Update)
router.put("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await findUserByEmail(email);

    const updatedProfile = await VolunteerProfile.findOneAndUpdate(
      { user: user._id },
      req.body,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(updatedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Volunteer Profile
router.delete("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await findUserByEmail(email);

    const profile = await VolunteerProfile.findOneAndDelete({ user: user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json({ message: "Profile deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
