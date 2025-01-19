const express = require("express");
const router = express.Router();
const TeamCommunication = require("../models/TeamCommunication");
const VolunteerOpportunity = require("../models/VolunteerOpportunity");
const User = require("../models/User");

// Create a new Message
router.post("/", async (req, res) => {
  try {
    const { opportunityId, senderEmail, message, attachments } = req.body;
    const sender = await User.findOne({ email: senderEmail });
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    const opportunity = await VolunteerOpportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const newMessage = new TeamCommunication({
      opportunity: opportunity._id,
      sender: sender._id,
      message,
      attachments,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Messages for a Specific Opportunity
router.get("/:opportunityId", async (req, res) => {
  try {
    const { opportunityId } = req.params;

    const messages = await TeamCommunication.find({ opportunity: opportunityId }).populate("sender");
    res.status(200).json(messages);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a Message (Partial Update)
router.put("/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const updatedMessage = await TeamCommunication.findByIdAndUpdate(messageId, req.body, { new: true });
    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json(updatedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a Message
router.delete("/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const deletedMessage = await TeamCommunication.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
