// models/DisasterAwareness.js
const mongoose = require('mongoose');

const AwarenessSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // e.g., "Earthquake"
    introduction: { type: String, required: true },
    topics: [
      {
        title: { type: String, required: true },
        description: [{ type: String, required: true }],
      },
    ],
    media: [
      {
        type: { type: String, enum: ['image', 'video'], required: true },
        url: { type: String, required: true, match: [/^https?:\/\//, 'Invalid URL format'] },
      },
    ],
    resources: [
      {
        title: { type: String, required: true },
        link: { type: String, required: true, match: [/^https?:\/\//, 'Invalid URL format'] },
      },
    ],
  },
  { timestamps: true } // This adds `createdAt` and `updatedAt` fields automatically.
);

module.exports = mongoose.model('Awareness', AwarenessSchema);
