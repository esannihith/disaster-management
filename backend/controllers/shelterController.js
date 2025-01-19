const Shelter = require('../models/Shelter'); // Assuming Shelter model is located here

// Create a new shelter with photo upload
exports.createShelter = async (req, res) => {
    try {
        const { name, location, type, capacity, facilities, contact } = req.body;

        // Validate required fields
        if (!name || !location || !type || !capacity || !facilities || !contact) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // If there's a photo, store the ObjectId of the uploaded file
        const photo = req.file ? req.file.id : null;

        // Create the shelter document
        const shelter = new Shelter({
            name,
            location,
            type,
            capacity,
            facilities,
            contact,
            photo,  // Store the reference to the uploaded file (single photo)
        });

        // Save the shelter
        await shelter.save();
        res.status(201).json(shelter);
    } catch (error) {
        console.error("Error creating shelter:", error);
        res.status(400).json({ error: "Error creating shelter", message: error.message });
    }
};

// Get all shelters and populate affiliatedDisasters field
exports.getAllShelters = async (req, res) => {
    try {
        const shelters = await Shelter.find()
            .populate('affiliatedDisasters'); // Populate the affiliatedDisasters field

        res.status(200).json(shelters);
    } catch (error) {
        console.error('Error fetching shelters:', error);
        res.status(500).json({ error: "Error fetching shelters", message: error.message });
    }
};

// Get shelter by ID and populate affiliatedDisasters field
exports.getShelterById = async (req, res) => {
    try {
        const shelter = await Shelter.findById(req.params.id)
            .populate('affiliatedDisasters'); // Populate the affiliatedDisasters field

        if (!shelter) {
            return res.status(404).json({ error: "Shelter not found" });
        }

        res.status(200).json(shelter);
    } catch (error) {
        console.error('Error fetching shelter:', error);
        res.status(500).json({ error: 'Error fetching shelter', message: error.message });
    }
};

// Update an existing shelter (can upload a new photo)
exports.updateShelter = async (req, res) => {
    try {
        const shelterId = req.params.id;

        // Fetch the shelter to be updated
        const shelter = await Shelter.findById(shelterId).populate('affiliatedDisasters');
        if (!shelter) {
            return res.status(404).json({ error: "Shelter not found" });
        }

        // Validate and update fields from req.body
        const {
            name,
            location,
            type,
            capacity,
            availability,
            facilities,
            services,
            contact,
            affiliatedDisasters,
            photo,
            coordinator,
        } = req.body;

        // Dynamically update the fields if provided
        if (name) shelter.name = name;
        if (location) shelter.location = location; // Ensure valid coordinates and address
        if (type) shelter.type = type;
        if (capacity) shelter.capacity = capacity;
        if (availability !== undefined) shelter.availability = availability; // Allow 0 or other values
        if (facilities) shelter.facilities = facilities;
        if (services) shelter.services = services;
        if (contact) shelter.contact = contact; // Update contact details if provided
        if (affiliatedDisasters) shelter.affiliatedDisasters = affiliatedDisasters; // Update affiliatedDisasters
        if (photo) shelter.photo = photo; // If a new photo is uploaded, update it
        if (coordinator) shelter.coordinator = coordinator; // Update coordinator if provided

        // Handle photo upload separately (if new photo is uploaded)
        if (req.file) {
            shelter.photo = req.file.id;
        }

        // Optionally validate the coordinates if location is provided
        if (location && location.coordinates) {
            const { coordinates } = location;
            if (
                coordinates.length !== 2 ||
                typeof coordinates[0] !== 'number' ||
                typeof coordinates[1] !== 'number'
            ) {
                return res.status(400).json({ error: "Invalid coordinates format" });
            }
        }

        // Ensure availability does not exceed capacity
        if (availability > shelter.capacity) {
            return res.status(400).json({ error: "Availability cannot exceed capacity." });
        }

        // Save the updated shelter document
        await shelter.save();
        res.status(200).json(shelter);
    } catch (error) {
        console.error("Error updating shelter:", error);
        res.status(400).json({ error: "Error updating shelter", message: error.message });
    }
};

// Delete a shelter
exports.deleteShelter = async (req, res) => {
    try {
        const shelterId = req.params.id;

        // Fetch the shelter to be deleted
        const shelter = await Shelter.findById(shelterId);
        if (!shelter) {
            return res.status(404).json({ error: "Shelter not found" });
        }

        // Delete the shelter using deleteOne()
        await Shelter.deleteOne({ _id: shelterId });

        res.status(200).json({ message: "Shelter deleted successfully" });
    } catch (error) {
        console.error("Error deleting shelter:", error);
        res.status(500).json({ error: "Error deleting shelter", message: error.message });
    }
};
