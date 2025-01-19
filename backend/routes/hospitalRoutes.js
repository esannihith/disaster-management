const express = require("express");
const { createHospital, getAllHospitals, getHospitalById, updateHospital, deleteHospital } = require("../controllers/hospitalController");
const { upload } = require("../config/upload"); // Import multer configuration
const router = express.Router();

// Route for creating a hospital with photo upload
router.post("/", upload.single("photo"), createHospital);

// Route for getting all hospitals
router.get("/", getAllHospitals);

// Route for getting a hospital by ID
router.get("/:id", getHospitalById);

// Route for updating a hospital by ID with photo upload
router.put("/:id", upload.single("photo"), updateHospital);

// Route for deleting a hospital by ID
router.delete("/:id", deleteHospital);

module.exports = router;
