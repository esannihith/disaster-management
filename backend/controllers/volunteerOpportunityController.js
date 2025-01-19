const VolunteerOpportunity = require("../models/VolunteerOpportunity");
const User = require("../models/User");

// @desc Create a new volunteer opportunity
// @route POST /api/volunteer-opportunities
// @access Public
const createVolunteerOpportunity = async (req, res) => {
  try {
    const opportunity = new VolunteerOpportunity(req.body);
    const savedOpportunity = await opportunity.save();
    res.status(201).json(savedOpportunity);
  } catch (error) {
    res.status(500).json({ message: "Error creating volunteer opportunity", error });
  }
};

// @desc Get all volunteer opportunities
// @route GET /api/volunteer-opportunities
// @access Public
const getAllVolunteerOpportunities = async (req, res) => {
  try {
    const opportunities = await VolunteerOpportunity.find().populate("volunteers.userId", "username email");
    res.status(200).json(opportunities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching volunteer opportunities", error });
  }
};

// @desc Get a volunteer opportunity by ID
// @route GET /api/volunteer-opportunities/:id
// @access Public
const getVolunteerOpportunityById = async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.findById(req.params.id).populate("volunteers.userId", "username email");
    if (!opportunity) {
      return res.status(404).json({ message: "Volunteer opportunity not found" });
    }
    res.status(200).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: "Error fetching volunteer opportunity", error });
  }
};

// @desc Update a volunteer opportunity
// @route PATCH /api/volunteer-opportunities/:id
// @access Public
const updateVolunteerOpportunity = async (req, res) => {
  try {
    const updateData = req.body;

    // Validate that there is something to update
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const updatedOpportunity = await VolunteerOpportunity.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true } // `runValidators` ensures validation on update
    );

    if (!updatedOpportunity) {
      return res.status(404).json({ message: "Volunteer opportunity not found" });
    }

    res.status(200).json(updatedOpportunity);
  } catch (error) {
    res.status(500).json({ message: "Error updating volunteer opportunity", error });
  }
};

// @desc Delete a volunteer opportunity
// @route DELETE /api/volunteer-opportunities/:id
// @access Public
const deleteVolunteerOpportunity = async (req, res) => {
  try {
    const deletedOpportunity = await VolunteerOpportunity.findByIdAndDelete(req.params.id);
    if (!deletedOpportunity) {
      return res.status(404).json({ message: "Volunteer opportunity not found" });
    }
    res.status(200).json({ message: "Volunteer opportunity deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting volunteer opportunity", error });
  }
};

// @desc Sign up a volunteer for an activity
// @route POST /api/volunteer-opportunities/:id/signup
// @access Public
const signUpForOpportunity = async (req, res) => {
  try {
    const { email } = req.body; // Frontend sends email in the request body
    const opportunity = await VolunteerOpportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Volunteer opportunity not found" });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user || user.role !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can sign up for opportunities" });
    }

    // Check if the user is already signed up
    const isAlreadySignedUp = opportunity.volunteers?.some(
      (vol) => vol.userId.toString() === user._id.toString()
    );

    if (isAlreadySignedUp) {
      return res.status(400).json({ message: "You have already signed up for this opportunity" });
    }

    // Add user to opportunity's volunteer list with "pending" status
    opportunity.volunteers.push({ userId: user._id, status: "pending" });
    await opportunity.save();

    // Add opportunity to user's volunteeringHistory
    user.volunteeringHistory.push({
      opportunityId: opportunity._id,
      status: "ongoing",
    });
    await user.save();

    res.status(200).json({ message: "Thank you for signing up! Your request is pending approval." });
  } catch (error) {
    res.status(500).json({ message: "Error signing up for the opportunity", error });
  }
};

module.exports = {
  createVolunteerOpportunity,
  getAllVolunteerOpportunities,
  getVolunteerOpportunityById,
  updateVolunteerOpportunity,
  deleteVolunteerOpportunity,
  signUpForOpportunity,
};
