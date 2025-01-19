// server/routes/subscriptionRoutes.js
const express = require('express');
const { sendOtp, verifyOtp } = require('../controllers/subscriptionController');

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;
