// routes/volunteerOpportunityRoutes.js
const express = require("express");
const {
  createVolunteerOpportunity,
  getAllVolunteerOpportunities,
  getVolunteerOpportunityById,
  updateVolunteerOpportunity,
  deleteVolunteerOpportunity,
  signUpForOpportunity,
} = require("../controllers/volunteerOpportunityController");

const router = express.Router();

router.post("/", createVolunteerOpportunity); // Public
router.get("/", getAllVolunteerOpportunities); // Public
router.get("/:id", getVolunteerOpportunityById); // Public
router.patch("/:id", updateVolunteerOpportunity); // Public
router.delete("/:id", deleteVolunteerOpportunity); // Public
router.post("/:id/signup", signUpForOpportunity); // Public (relies on frontend validation)

module.exports = router;
