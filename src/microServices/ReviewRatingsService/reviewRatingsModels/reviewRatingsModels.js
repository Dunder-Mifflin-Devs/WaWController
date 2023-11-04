const mongoose = require('mongoose');

const ratingReviewSchema = new mongoose.Schema({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaId: {
        type: String,
        required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
}); 

module.exports = mongoose.model('Ratings', ratingReviewSchema, 'review-ratings'); // (ModelName, SchemaName, MongoDB collection name)