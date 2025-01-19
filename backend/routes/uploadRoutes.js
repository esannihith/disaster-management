const express = require("express");
const { getFileById } = require("../controllers/uploadController");
const router = express.Router();

// Route for fetching a photo by its ID
router.get("/:photoId", getFileById);

module.exports = router;
