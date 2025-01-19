const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    isRecurring: { type: Boolean, default: false },
    message: { type: String },
    paymentId: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED'], default: 'PENDING' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
