const SupplyDonation = require('../models/SupplyDonation');

// Create a new supply donation
exports.createSupplyDonation = async (req, res) => {
  try {
    const { name, email, supplyType, quantity, dropOffLocation, message, photoId, donorId } = req.body;

    // Validate required fields
    if (!name || !email || !supplyType || !quantity || !dropOffLocation) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create the donation record
    const newDonation = await SupplyDonation.create({
      name,
      email,
      supplyType,
      quantity,
      dropOffLocation,
      message,
      photoId,
      donorId,
    });

    res.status(201).json({ message: "Donation submitted successfully", donation: newDonation });
  } catch (error) {
    console.error("Error creating supply donation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all supply donations
exports.getSupplyDonations = async (req, res) => {
  try {
    const donations = await SupplyDonation.find()
      .populate('dropOffLocation', 'name address')
      .populate('photoId', 'filename')
      .populate('donorId', 'name email'); // Populate references
    res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching supply donations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single supply donation by ID
exports.getSupplyDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await SupplyDonation.findById(id)
      .populate('dropOffLocation', 'name address')
      .populate('photoId', 'filename')
      .populate('donorId', 'name email');

    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.status(200).json(donation);
  } catch (error) {
    console.error("Error fetching supply donation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a supply donation (partial updates allowed)
exports.updateSupplyDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedDonation = await SupplyDonation.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedDonation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.status(200).json({ message: "Donation updated successfully", donation: updatedDonation });
  } catch (error) {
    console.error("Error updating supply donation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a supply donation
exports.deleteSupplyDonation = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDonation = await SupplyDonation.findByIdAndDelete(id);

    if (!deletedDonation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error("Error deleting supply donation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
