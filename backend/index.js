const express = require('express');
const disasterRoutes = require('./routes/disasterRoutes');
const shelterRoutes = require('./routes/shelterRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const DisasterPreparedness = require('./routes/DisasterPreparedness')
const connectDB = require('./config/db');
const uploadRoutes = require('./routes/uploadRoutes');
const DisasterAwarenessRoutes = require('./routes/disasterAwarenessRoutes')
const authRoutes = require('./routes/authRoutes')
const HomePageRoutes = require('./routes/HomePage')
const donationRoutes = require('./routes/donationRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes')
const supplyDonationRoutes = require('./routes/supplyDonationRoutes');
const volunteerOpportunityRoutes = require("./routes/volunteerOpportunityRoutes");
const dropOffLocationRoutes = require("./routes/dropOffLocationRoutes")
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from frontend (Vite on port 3000)
app.use(express.json());

// Start server only after DB connection and GridFS bucket initialization
const startServer = async () => {
    try {
        // Await the database connection and GridFS bucket initialization
        await connectDB();
        console.log("MongoDB connected and GridFS bucket initialized.");

        // API routes
        app.use('/api/disasters', disasterRoutes);
        app.use('/api/shelters', shelterRoutes);  // Add shelter routes
        app.use('/api/hospitals', hospitalRoutes); // Add hospital routes
        app.use('/api/uploads', uploadRoutes);    // Add upload routes
        app.use('/api/preparedness',DisasterPreparedness);
        app.use('/api/awareness',DisasterAwarenessRoutes);
        app.use('/api/auth',authRoutes);
        app.use('/api/donations', donationRoutes);
        app.use('/api/homepage',HomePageRoutes);
        app.use('/api/subscribe',subscriptionRoutes);
        app.use('/api/supplyDonations', supplyDonationRoutes);
        app.use("/api/dropOffLocations",dropOffLocationRoutes);

        app.use("/api/volunteer-opportunities", volunteerOpportunityRoutes);
        app.use("/api/notifications",require("./routes/Notification"));
        app.use("/api/volunteer-profile", require("./routes/volunteerProfileRoutes"));
        app.use("/api/reports", require("./routes/reportRoutes"));
        app.use("/api/team-communications", require("./routes/teamCommunicationRoutes"));
        app.use("/api/settings", require("./routes/settingsRoutes"));


        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ message: 'Internal server error' });
        });

        // Start the server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("Error during server startup:", err);
        process.exit(1); // Exit if DB connection fails
    }
};

// Start the server
startServer();
