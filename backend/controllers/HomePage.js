const HomePage = require("../models/HomePage");

// GET: Fetch the HomePage data
exports.getHomePage = async (req, res) => {
  try {
    const homePage = await HomePage.findOne();
    if (!homePage) {
      return res.status(404).json({ message: "HomePage data not found." });
    }
    res.status(200).json(homePage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST: Create or update the HomePage data
exports.createOrUpdateHomePage = async (req, res) => {
  try {
    const { hero, accordion, activeDisasters, heroesOfTheDay, mediaGallery } = req.body;

    let homePage = await HomePage.findOne();

    if (homePage) {
      // If HomePage exists, update it
      homePage.hero = hero || homePage.hero;
      homePage.accordion = accordion || homePage.accordion;
      homePage.activeDisasters = activeDisasters || homePage.activeDisasters;
      homePage.heroesOfTheDay = heroesOfTheDay || homePage.heroesOfTheDay;
      homePage.mediaGallery = mediaGallery || homePage.mediaGallery;

      await homePage.save();
      return res.status(200).json(homePage);
    } else {
      // If no HomePage exists, create a new one
      homePage = new HomePage({
        hero,
        accordion,
        activeDisasters,
        heroesOfTheDay,
        mediaGallery,
      });

      await homePage.save();
      return res.status(201).json(homePage);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT: Update HomePage data
exports.updateHomePage = async (req, res) => {
  try {
    const { hero, accordion, activeDisasters, heroesOfTheDay, mediaGallery } = req.body;

    let homePage = await HomePage.findOne();

    if (!homePage) {
      return res.status(404).json({ message: "HomePage data not found." });
    }

    homePage.hero = hero || homePage.hero;
    homePage.accordion = accordion || homePage.accordion;
    homePage.activeDisasters = activeDisasters || homePage.activeDisasters;
    homePage.heroesOfTheDay = heroesOfTheDay || homePage.heroesOfTheDay;
    homePage.mediaGallery = mediaGallery || homePage.mediaGallery;

    await homePage.save();
    return res.status(200).json(homePage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE: Delete the HomePage data
exports.deleteHomePage = async (req, res) => {
  try {
    const homePage = await HomePage.findOne();
    if (!homePage) {
      return res.status(404).json({ message: "HomePage data not found." });
    }

    await homePage.delete();
    res.status(200).json({ message: "HomePage data deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
