// controllers/disasterAwarenessController.js
const Awareness = require('../models/DisasterAwareness');

// Get all disaster awareness entries
const getAll = async (req, res) => {
  try {
    const awarenessList = await Awareness.find();
    return res.status(200).json(awarenessList);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get disaster awareness by type
const getByType = async (req, res) => {
  const { type } = req.params;

  try {
    const awareness = await Awareness.findOne({ type });
    
    if (!awareness) {
      return res.status(404).json({ message: `No awareness found for type: ${type}` });
    }

    return res.status(200).json(awareness);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new disaster awareness entry
const create = async (req, res) => {
  const { type, introduction, topics, media, resources } = req.body;

  try {
    // Validate required fields
    if (!type || !introduction || !topics || !media || !resources) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newAwareness = new Awareness({
      type,
      introduction,
      topics,
      media,
      resources
    });

    const savedAwareness = await newAwareness.save();
    return res.status(201).json(savedAwareness);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAll,
  getByType,
  create,
};
