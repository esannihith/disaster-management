const express = require("express");
const { createShelter, getAllShelters, getShelterById, updateShelter, deleteShelter } = require("../controllers/shelterController");
const { upload } = require("../config/upload"); // Import the upload middleware
const router = express.Router();

// Route to create a new shelter with a single photo upload
router.post("/", upload.single("photo"), createShelter);  // Only upload a single photo per shelter

// Route to get all shelters
router.get("/", getAllShelters);

// Route to get shelter by ID
router.get("/:id", getShelterById);

// Route to update an existing shelter
router.put("/:id", upload.single("photo"), updateShelter); // Upload a new photo (if necessary)

// Route to delete a shelter
router.delete("/:id", deleteShelter);

module.exports = router;
