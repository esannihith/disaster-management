// routes/disasterAwarenessRoutes.js
const express = require('express');
const router = express.Router();
const disasterAwarenessController = require('../controllers/disasterAwarenessController');

// GET all disaster awareness entries
router.get('/', disasterAwarenessController.getAll);

// GET disaster awareness by type (e.g., "Earthquake")
router.get('/:type', disasterAwarenessController.getByType);

// POST create a new disaster awareness entry
router.post('/', disasterAwarenessController.create);

module.exports = router;
