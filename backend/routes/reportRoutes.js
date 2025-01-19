const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const VolunteerProfile = require("../models/VolunteerProfile");
const VolunteerOpportunity = require("../models/VolunteerOpportunity");
const User = require("../models/User");

// Middleware to find volunteer profile by email
const findProfileByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const profile = await VolunteerProfile.findOne({ user: user._id });
  if (!profile) {
    throw new Error("Volunteer profile not found");
  }
  return profile;
};

// Create a new Report
router.post("/", async (req, res) => {
  try {
    const { email, opportunityId, content } = req.body;
    const profile = await findProfileByEmail(email);
    const opportunity = await VolunteerOpportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const newReport = new Report({
      volunteerProfile: profile._id,
      opportunity: opportunity._id,
      content,
    });

    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Reports for a Volunteer
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const profile = await findProfileByEmail(email);

    const reports = await Report.find({ volunteerProfile: profile._id }).populate("opportunity");
    res.status(200).json(reports);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Report (Partial Update)
router.put("/:reportId", async (req, res) => {
  try {
    const { reportId } = req.params;
    const updatedReport = await Report.findByIdAndUpdate(reportId, req.body, { new: true });
    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(updatedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Report
router.delete("/:reportId", async (req, res) => {
  try {
    const { reportId } = req.params;
    const deletedReport = await Report.findByIdAndDelete(reportId);
    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ message: "Report deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
