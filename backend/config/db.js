const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error('MONGODB_URI is not set in environment variables');
    process.exit(1); // Exit if MongoDB URI is not set
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the application if connection fails
  }
};

module.exports = connectDB;
