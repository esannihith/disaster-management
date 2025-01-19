const express = require('express');
const {
  createDropOffLocation,
  getDropOffLocations,
  getDropOffLocationById,
  updateDropOffLocation,
  deleteDropOffLocation,
} = require('../controllers/dropOffLocationController');

const router = express.Router();

// Route to create a drop-off location
router.post('/', createDropOffLocation);

// Route to get all drop-off locations
router.get('/', getDropOffLocations);

// Route to get a single drop-off location by ID
router.get('/:id', getDropOffLocationById);

// Route to update a drop-off location
router.patch('/:id', updateDropOffLocation);

// Route to delete a drop-off location
router.delete('/:id', deleteDropOffLocation);

module.exports = router;
