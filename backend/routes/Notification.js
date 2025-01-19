const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const User = require("../models/User");

// Create a Notification
router.post("/", async (req, res) => {
  try {
    const { email, content, type } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const newNotification = new Notification({
      user: user._id,
      content,
      type,
    });

    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Notifications for a User
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const notifications = await Notification.find({ user: user._id });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Notification (Partial)
router.put("/:notificationId", async (req, res) => {
  try {
    const { readStatus } = req.body;

    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { readStatus },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Notification
router.delete("/:notificationId", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.notificationId);

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
