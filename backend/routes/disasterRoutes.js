const express = require('express');
const router = express.Router();
const disasterController = require('../controllers/disasterController');

// POST /api/disasters - Create a new disaster
router.post('/', disasterController.createDisaster);

// GET /api/disasters/:id - Get a disaster by ID
router.get('/:id', disasterController.getDisasterById);

// GET /api/disasters - Get all disasters
router.get('/', disasterController.getAllDisasters);

// PATCH /api/disasters/:id - Update a disaster by ID
router.patch('/:id', disasterController.updateDisaster);

// DELETE /api/disasters/:id - Delete a disaster by ID
router.delete('/:id', disasterController.deleteDisaster);

module.exports = router;