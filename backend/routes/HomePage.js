const express = require("express");
const homePageController = require("../controllers/HomePage");
const router = express.Router();

// GET: Fetch the HomePage data
router.get("/", homePageController.getHomePage);

// POST: Create or update the HomePage data
router.post("/", homePageController.createOrUpdateHomePage);

// PUT: Update HomePage data
router.put("/", homePageController.updateHomePage);

// DELETE: Delete the HomePage data
router.delete("/", homePageController.deleteHomePage);

module.exports = router;
