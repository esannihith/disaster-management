const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    throw new Error('MongoDB URI is not set in environment variables');
}

const initializeUploadsBucket = async () => {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const filesCollectionExists = collections.some(col => col.name === 'uploads.files');
    const chunksCollectionExists = collections.some(col => col.name === 'uploads.chunks');

    if (!filesCollectionExists || !chunksCollectionExists) {
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
        
        // Create a placeholder file to initialize the bucket collections
        const uploadStream = bucket.openUploadStream('placeholder');
        uploadStream.end(Buffer.from('initializing collection'));

        uploadStream.on('finish', () => {
            bucket.delete(uploadStream.id); // Delete the placeholder file
            console.log("Uploads collection initialized successfully.");
        });

        uploadStream.on('error', (error) => {
            console.error("Error initializing uploads collection:", error);
        });
    }
};

// Ensure mongoose connects before attempting to initialize the bucket
mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected');
        initializeUploadsBucket();
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Set up multer storage
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return {
            filename: `${Date.now()}-${file.originalname}`,
            bucketName: 'uploads' // Name of the bucket in GridFS
        };
    }
});

const upload = multer({ storage });

module.exports = {upload};
