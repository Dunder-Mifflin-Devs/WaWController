const mongoose = require('mongoose');

// Schema for Media
const mediaSchema = new mongoose.Schema({
    // IMDB ID as a unique identifier for the media.
    imdbId: { type: String, required: true},

    // Total ratings sum up all the ratings given to this media.
    totalRatings: { type: Number, default: 0 },

    // Number of ratings counts how many users have rated this media.
    numberOfRatings: { type: Number, default: 0 }
});

// Exporting the Media model.
module.exports = mongoose.model('Media', mediaSchema);

