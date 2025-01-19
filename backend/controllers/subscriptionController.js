// /server/controllers/subscriptionController.js

const Subscriber = require('../models/Subscriber');
const axios = require('axios'); // Import axios
require('dotenv').config();

// Generate a random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
// console.log('Fast2SMS API Key:', process.env.FAST2SMS_API_KEY);
const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY

const message = 'This is sample message for project testing'

const sendOtp = async (mobileNumber) => {
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000); // 1 minute expiry

    // Create or update subscriber record
    await Subscriber.findOneAndUpdate(
        { mobileNumber },
        { otp, otpExpiry, subscribed: false },
        { upsert: true, new: true }
    );

    // Sending OTP using Fast2SMS API
    const options = {
        method: 'POST',
        url: 'https://www.fast2sms.com/dev/bulkV2',
        headers: {
            'authorization': FAST2SMS_API_KEY,
        },
        data: {
            message: `${message}. Your OTP is ${otp}. It is valid for 1 minute.`,
            language: 'english',
            route: 'q', 
            numbers: mobileNumber.toString(), 
        },
    };
    

    try {
        const response = await axios(options);
        //console.log('Fast2SMS Response:', response.data);

        // Check if the response indicates success
        if (!response.data.return) {
            throw new Error(`Failed to send OTP: ${response.data.message}`);
        }

        return { success: true, message: 'OTP sent successfully!' };
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error('Failed to send OTP');
    }
};

exports.sendOtp = async (req, res) => {
    const { mobileNumber } = req.body;

    try {
        // Check for existing subscriber
        const subscriber = await Subscriber.findOne({ mobileNumber });

        // Clear expired OTPs if any
        if (subscriber && subscriber.otpExpiry < new Date()) {
            subscriber.otp = null; // Clear expired OTP
            subscriber.otpExpiry = null; // Clear expired OTP expiry
            await subscriber.save();
        }

        if (subscriber && subscriber.subscribed) {
            return res.status(200).json({ success: false, message: 'You are already subscribed.' });
        }

        // Use sendOtp function to handle OTP generation and sending
        const response = await sendOtp(mobileNumber);
        return res.status(200).json(response);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
    }
};

exports.verifyOtp = async (req, res) => {
    const { mobileNumber, otp } = req.body;

    try {
        const subscriber = await Subscriber.findOne({ mobileNumber });

        // Check if subscriber exists
        if (!subscriber) {
            return res.status(404).json({ success: false, message: 'Subscriber not found.' });
        }

        // Check if OTP matches and if it has expired
        if (subscriber.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
        }

        if (subscriber.otpExpiry < new Date()) {
            // Clear OTP and expiry since it has expired
            subscriber.otp = null; // Clear expired OTP
            subscriber.otpExpiry = null; // Clear expired OTP expiry
            await subscriber.save();

            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new OTP.' });
        }

        // Mark subscriber as subscribed upon successful verification
        subscriber.subscribed = true;
        subscriber.otp = null; // Clear OTP after successful verification
        subscriber.otpExpiry = null; // Clear OTP expiry
        await subscriber.save();

        return res.status(200).json({ success: true, message: 'Subscription successful!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
};
