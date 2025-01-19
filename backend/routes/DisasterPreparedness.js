// routes/DisasterPreparedness.js
const express = require('express');
const router = express.Router();
const DisasterPreparednessController = require('../controllers/DisasterPreparedness');

// Route to get all disaster preparedness information
router.get('/', DisasterPreparednessController.getAllPreparedness);

// Route to get preparedness info for a specific disaster by type
router.get('/:type', DisasterPreparednessController.getPreparednessByType);

// Route to post a new disaster preparedness entry
router.post('/', DisasterPreparednessController.createPreparedness);

module.exports = router;
