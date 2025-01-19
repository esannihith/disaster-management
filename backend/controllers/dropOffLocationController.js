const DropOffLocation = require('../models/DropOffLocation');

// Create a new drop-off location
exports.createDropOffLocation = async (req, res) => {
  try {
    const { name, address, coordinates, contact, hours, type, photoId, coordinatorId } = req.body;

    // Validate required fields
    if (!name || !address || !coordinates || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newLocation = await DropOffLocation.create({
      name,
      address,
      coordinates,
      contact,
      hours,
      type,
      photoId,
      coordinatorId,
    });

    res.status(201).json({ message: "Drop-off location created successfully", location: newLocation });
  } catch (error) {
    console.error("Error creating drop-off location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all drop-off locations
exports.getDropOffLocations = async (req, res) => {
  try {
    const locations = await DropOffLocation.find()
      .populate('photoId', 'filename')
      .populate('coordinatorId', 'name email');
    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching drop-off locations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single drop-off location by ID
exports.getDropOffLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await DropOffLocation.findById(id)
      .populate('photoId', 'filename')
      .populate('coordinatorId', 'name email');

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.status(200).json(location);
  } catch (error) {
    console.error("Error fetching drop-off location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a drop-off location
exports.updateDropOffLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedLocation = await DropOffLocation.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedLocation) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.status(200).json({ message: "Location updated successfully", location: updatedLocation });
  } catch (error) {
    console.error("Error updating drop-off location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a drop-off location
exports.deleteDropOffLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLocation = await DropOffLocation.findByIdAndDelete(id);

    if (!deletedLocation) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("Error deleting drop-off location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
