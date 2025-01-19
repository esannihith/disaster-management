const express = require('express');
const { createOrder, captureOrder } = require('../controllers/donationController');

const router = express.Router();

// Create PayPal Order
router.post('/create-order', createOrder);

// Capture PayPal Order
router.post('/capture-order/:id', captureOrder);

module.exports = router;
