const mongoose = require("mongoose");

// Schema for Media
const mediaSchema = new mongoose.Schema({
  imdbId: { type: String, required: true },
  totalRatings: { type: Number, default: 0 },
  numberOfRatings: { type: Number, default: 0 },
});

module.exports = mongoose.model("Media", mediaSchema);
