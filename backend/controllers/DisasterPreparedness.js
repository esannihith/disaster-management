// controllers/DisasterPreparednessController.js
const DisasterPreparedness = require('../models/DisasterPreparedness');

// Get all disaster preparedness information
const getAllPreparedness = async (req, res) => {
  try {
    const data = await DisasterPreparedness.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching disasters', error: err });
  }
};

// Get preparedness info for a specific disaster by type
const getPreparednessByType = async (req, res) => {
  const { type } = req.params;
  try {
    const data = await DisasterPreparedness.findOne({ type });
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: 'Disaster type not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching disaster data', error: err });
  }
};

// Create new disaster preparedness entry
const createPreparedness = async (req, res) => {
  const { type, description, guidelines, steps, media } = req.body;
  try {
    const newPreparedness = new DisasterPreparedness({ type, description, guidelines, steps, media });
    await newPreparedness.save();
    res.status(201).json({ message: 'Disaster preparedness created successfully', data: newPreparedness });
  } catch (err) {
    res.status(500).json({ message: 'Error creating disaster preparedness', error: err });
  }
};

module.exports = { getAllPreparedness, getPreparednessByType, createPreparedness };
