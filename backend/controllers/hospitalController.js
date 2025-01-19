const Hospital = require("../models/Hospital");
const mongoose = require("mongoose");

// Create a new hospital with photo upload
exports.createHospital = async (req, res) => {
  try {
    const { name, location, facilities, capacity, contact, services, emergencyBeds, availabilityStatus } = req.body;

    // Validate and process the input data
    if (!name || !location || !facilities || !capacity || !contact) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // If a photo is uploaded, store the ObjectId of the uploaded file from GridFS
    const photo = req.file ? req.file.id : null;

    // Create the hospital document
    const hospital = new Hospital({
      name,
      location,
      facilities,
      capacity,
      contact,
      photo, // Store the reference to the uploaded file (photo)
      services: services || [], // Default to an empty array if no services are provided
      emergencyBeds: emergencyBeds || 0, // Default to 0 if no emergencyBeds are provided
      availabilityStatus: availabilityStatus || "Open", // Default to "Open" if no availability status is provided
    });

    // Save the hospital
    await hospital.save();
    res.status(201).json(hospital); // Respond with the created hospital
  } catch (error) {
    console.error("Error creating hospital:", error);
    res.status(500).json({
      error: `Error creating hospital: ${error.message || error}`,
    });
  }
};

// Get all hospitals
exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json(hospitals); // Return the list of hospitals
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ error: `Error fetching hospitals: ${error.message || error}` });
  }
};

// Get hospital by ID
exports.getHospitalById = async (req, res) => {
  try {
    // Get the ID from the URL parameters
    const { id } = req.params;

    // Validate the ID format (it should be a valid MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid hospital ID format" });
    }

    // Query the database for the hospital
    const hospital = await Hospital.findById(id);

    // If the hospital is not found, return a 404 error
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    // Return the hospital data
    res.status(200).json(hospital);
  } catch (error) {
    console.error("Error fetching hospital:", error);
    res.status(500).json({
      error: `Internal Server Error: ${error.message || error}`,
    });
  }
};

// Update hospital by ID
exports.updateHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, facilities, capacity, contact, services, emergencyBeds, availabilityStatus } = req.body;

    // Validate the ID format (it should be a valid MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid hospital ID format" });
    }

    // Query the database for the hospital to check if it exists
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    // If a photo is uploaded, update the reference
    const photo = req.file ? req.file.id : hospital.photo;

    // Update the hospital document
    hospital.name = name || hospital.name;
    hospital.location = location || hospital.location;
    hospital.facilities = facilities || hospital.facilities;
    hospital.capacity = capacity || hospital.capacity;
    hospital.contact = contact || hospital.contact;
    hospital.services = services || hospital.services;
    hospital.emergencyBeds = emergencyBeds || hospital.emergencyBeds;
    hospital.availabilityStatus = availabilityStatus || hospital.availabilityStatus;
    hospital.photo = photo;

    // Save the updated hospital
    await hospital.save();
    res.status(200).json(hospital); // Respond with the updated hospital
  } catch (error) {
    console.error("Error updating hospital:", error);
    res.status(500).json({
      error: `Error updating hospital: ${error.message || error}`,
    });
  }
};

// Delete hospital by ID
exports.deleteHospital = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate the ID format (it should be a valid MongoDB ObjectId)
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid hospital ID format" });
      }
  
      // Query the database for the hospital to check if it exists
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        return res.status(404).json({ error: "Hospital not found" });
      }
  
      // Delete the hospital
      await Hospital.deleteOne({ _id: id });
  
      res.status(200).json({ message: "Hospital deleted successfully" });
    } catch (error) {
      console.error("Error deleting hospital:", error);
      res.status(500).json({
        error: `Error deleting hospital: ${error.message || error}`,
      });
    }
  };
  