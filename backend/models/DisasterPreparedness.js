// models/DisasterPreparedness.js
const mongoose = require('mongoose');

const disasterPreparednessSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: String,
  guidelines: {
    before: [String],
    during: [String],
    after: [String],
  },
  steps: [String],
  media: [
    { 
      url: { type: String, required: true }, 
      type: { type: String, required: true } 
    }
  ],
});


const DisasterPreparedness = mongoose.model('DisasterPreparedness', disasterPreparednessSchema);

module.exports = DisasterPreparedness;
