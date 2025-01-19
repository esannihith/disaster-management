const mongoose = require('mongoose');

const subscriberSchema = mongoose.Schema({
    mobileNumber: {
        type: Number,
        required: true,
        unique: true, // Ensure mobile numbers are unique
    },
    subscribed: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String, // Store the OTP temporarily
    },
    otpExpiry: {
        type: Date, // Store the OTP expiration time
    },
    isVerified: {
        type: Boolean,
        default: false, // Mark verified after OTP confirmation
    },
    disasterPreferences: {
        type: [String], // Array of disaster types
        default: [], // Empty array means all disaster types
    },
    subscriptionDate: {
        type: Date,
        default: Date.now, // Automatically set subscription date
    },
    location: {
        type: String, // Optional: Preferred location for alerts
    },
    lastAlertSent: {
        type: Date, // Timestamp of the last alert sent to this subscriber
    },
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;