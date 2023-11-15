const mongoose = require('mongoose');

// Schema for combined Reviews and Ratings
const reviewRatingSchema = new mongoose.Schema({
    // Common fields for both reviews and ratings
    userId: mongoose.Schema.Types.ObjectId, // Link to the user who wrote the review or gave the rating
    mediaId: String, // IMDB ID or similar identifier for the media

    // Rating specific fields
    rating: {
        type: Number,
        required: false // Set to true if you want to enforce rating
    },

    // Review specific fields
    reviewContent: {
        type: String,
        required: false // Set to true if you want to enforce review text
    }
});

// Exporting the ReviewRating model
module.exports = mongoose.model('ReviewRating', reviewRatingSchema);
