const mongoose = require('mongoose');

exports.getFileById = async (req, res) => {
  try {
    // Ensure that Mongoose is connected before proceeding
    if (!mongoose.connection.readyState) {
      return res.status(500).json({ error: "MongoDB not connected" });
    }

    // Access the database from mongoose
    const db = mongoose.connection.db;

    // Create a new GridFSBucket instance with the 'uploads' bucket name
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });

    // Extract the photoId from the request params
    const { photoId } = req.params;

    // Validate the photoId format (check if it's a valid ObjectId)
    if (!mongoose.Types.ObjectId.isValid(photoId)) {
      return res.status(400).json({ error: "Invalid photoId format" });
    }

    // Query GridFS for the file using the ObjectId
    const file = await bucket.find({ _id: new mongoose.Types.ObjectId(photoId) }).toArray();

    if (!file || file.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    const { contentType, filename } = file[0];
    res.set('Content-Type', contentType);
    res.set('Content-Disposition', `inline; filename="${filename}"`);

    const readStream = bucket.openDownloadStream(file[0]._id);
    readStream.pipe(res);

    // Handle errors during file streaming
    readStream.on('error', (err) => {
      console.error('Error streaming file:', err);
      res.status(500).json({ error: 'Error streaming the file', message: err.message });
    });

  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};
