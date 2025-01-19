const express = require("express");
const router = express.Router();
const UserSettings = require("../models/Settings");
const User = require("../models/User");

// Create or Update Settings
router.post("/", async (req, res) => {
  try {
    const { email, preferences, notifications } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    let settings = await UserSettings.findOne({ user: user._id });

    if (settings) {
      settings.preferences = preferences;
      settings.notifications = notifications;
      await settings.save();
      return res.status(200).json(settings);
    }

    settings = new UserSettings({ user: user._id, preferences, notifications });
    await settings.save();
    res.status(201).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Settings
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const settings = await UserSettings.findOne({ user: user._id });

    if (!settings) return res.status(404).json({ message: "Settings not found" });

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
