const mongoose = require("mongoose");

const homePageSchema = new mongoose.Schema({
  // HERO SECTION
  hero: {
    imageUrl: { type: String, required: true },  // URL for hero image
  },

  // ACCORDION SECTION
  accordion: [
    {
      title: { type: String, required: true },
      links: [
        {
          text: { type: String, required: true },
          url: { type: String },  // URL for the link
        },
      ],
    },
  ],

  // ACTIVE DISASTERS SECTION
  activeDisasters: [
    {
      name: { type: String, required: true },
      emoji: { type: String, required: true },
    },
  ],

  // HEROES OF THE DAY SECTION
  heroesOfTheDay: [
    {
      name: { type: String, required: true },
      achievement: { type: String, required: true },
      backgroundColor: { type: String, required: true },
    },
  ],

  // MEDIA GALLERY SECTION
  mediaGallery: [
    {
      type: { type: String, enum: ["image", "video"], required: true },  // Type of media (image/video)
      content: { type: String, required: true },  // URL for the media (image or video)
      description: { type: String },  // Short description (optional)
    },
  ],
});

module.exports = mongoose.model("HomePage", homePageSchema);
