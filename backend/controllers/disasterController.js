// backend/controllers/disasterController.js
const Disaster = require('../models/Disaster');
const mongoose = require('mongoose')

// Create a new disaster
exports.createDisaster = async (req, res) => {
  try {
    const disasterData = req.body;

    // Check if all required fields are present (based on the final schema)
    if (!disasterData.type || !disasterData.location || !disasterData.dateTime || !disasterData.description || !disasterData.redZoneRange || !disasterData.severity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Optional fields can be omitted (e.g., impactSummary, emergencyContacts, media)
    const disaster = new Disaster(disasterData);
    await disaster.save();
    res.status(201).json({ message: 'Disaster created successfully', disaster });
  } catch (error) {
    res.status(500).json({ message: 'Error creating disaster', error: error.message });
  }
};

// Get details of a specific disaster by ID
exports.getDisasterById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the ID is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Find disaster by ID
    const disaster = await Disaster.findById(id);
    if (!disaster) {
      return res.status(404).json({ message: 'Disaster not found' });
    }

    res.status(200).json(disaster);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching disaster details', error: error.message });
  }
};

// Get all disasters
exports.getAllDisasters = async (req, res) => {
  try {
    const disasters = await Disaster.find({});
    res.status(200).json(disasters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching disasters', error: error.message });
  }
};

// Update a disaster (PATCH)
exports.updateDisaster = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if the ID is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Find the disaster and update
    const disaster = await Disaster.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
    if (!disaster) {
      return res.status(404).json({ message: 'Disaster not found' });
    }

    res.status(200).json({ message: 'Disaster updated successfully', disaster });
  } catch (error) {
    res.status(500).json({ message: 'Error updating disaster', error: error.message });
  }
};

// Delete a disaster
exports.deleteDisaster = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Delete the disaster by ID
    const disaster = await Disaster.findByIdAndDelete(id);
    
    if (!disaster) {
      return res.status(404).json({ message: 'Disaster not found' });
    }

    res.status(200).json({ message: 'Disaster deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting disaster', error: error.message });
  }
};
  