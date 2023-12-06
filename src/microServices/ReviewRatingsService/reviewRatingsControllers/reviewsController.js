const createError = require("http-errors");
const Rating = require("../reviewRatingsModels/reviewRatingsModels");
const Media = require("../../MediaService/mediaModels/mediaModels");

// Reviews Controller for fetching and posting to database
module.exports = {
  postRating: async (req, res) => {
    //grab the media, the user, and the rating

    const dbCallBody = {
      rating: req.params.rating,
      mediaId: req.params.id,
      userId: req.user._id,
    };
    let existingRating = await Rating.findOne({
      mediaId: dbCallBody.mediaId,
      userId: dbCallBody.userId,
    });
    // CHECK IF ONE DOCUMENT EXISTS
    if (existingRating) {
      this.putRating(req, res);
    }
    // MAKE A NEW RATING IF NO RATING OR REVIEW EXISTS
    else {
      const userRating = new Rating({
        _id: new mongoose.Types.ObjectId(),
        userId: dbCallBody.userId,
        mediaId: dbCallBody.mediaId,
        rating: dbCallBody.rating,
      });
      // Save that puppy if nonexistent
      await userRating.save();
      res.status(201).json({ success: true, message: "User rating added" });
      return { success: true, message: "User rating added" };
    }

    //verifyDbResponseSendStatus(req, res, dbCallBody)
  },

  postReview: async (req, res) => {
    const dbCallBody = {
      review: req.params.review,
      mediaId: req.params.id,
      userId: req.user._id,
    };
    let existingReview = await Rating.findOne({
      mediaId: dbCallBody.mediaId,
      userId: dbCallBody.userId,
    });
    // CHECK IF ONE DOCUMENT EXISTS
    if (existingReview) {
      this.putRating(req, res);
    }
    // MAKE A NEW RATING IF NO RATING OR REVIEW EXISTS
    const userReview = new Rating({
      _id: new mongoose.Types.ObjectId(),
      userId: dbCallBody.userId,
      mediaId: dbCallBody.mediaId,
      review: dbCallBody.review,
    });
    // Save that puppy
    await userReview.save();
    res.status(201).json({ success: true, message: "User rating added" });
    return { success: true, message: "User rating added" };
    //verifyDbResponseSendStatus(req, res, dbCallBody)
  },

    /*
    Updates a review and/or rating for a media by the logged in user
    example body:
        rating: 3
        review: "new review"
    */
    putReviewRating: async (req, res) => {
        try {
            const dbCallBody = {
                mediaId: req.params.mediaId,
                userId: req.user._id
            };

      const dbUpdate = {
        rating: req.body.rating || undefined,
        review: req.body.review || undefined,
        timestamp: Date.now(),
      };

            let oldReviewRating = await Rating.findOne(dbCallBody);
            let result = await Rating.updateOne(dbCallBody, dbUpdate, { runValidators: true });

            if (result.matchedCount === 0) {
                if (res) res.status(404).json({ success: false, message: 'Review/rating not found' });
                return { success: false, message: 'Review/rating not found' };
            }

            if (!(await Media.findOne({ imdbId: req.params.mediaId }))) {
                await Media.create({
                    imdbId: req.params.mediaId,
                    totalRatings: 0,
                    numberOfRatings: 0
                });
            }

            if (oldReviewRating.rating) {
                await Media.updateOne({ imdbId: req.params.mediaId }, {
                    $inc: {
                        totalRatings: -oldReviewRating.rating,
                        numberOfRatings: -1
                    }
                });
            }
            if (dbUpdate.rating) {
                await Media.updateOne({ imdbId: req.params.mediaId }, {
                    $inc: {
                        totalRatings: dbUpdate.rating,
                        numberOfRatings: 1
                    }
                });
            }

            if (res) res.status(201).json({ success: true, message: "Updated rating/review" });
            return { success: true, message: "Updated rating/review" };
        }
        catch(err) {
            console.error(err);
            if (res) res.status(400).json({ success: false, message: "Failed to update rating/review" });
            return { success: false, message: "Failed to update rating/review" };
        }
    }
  }

//TODO: not 100% sure this will work
/*
const verifyDbResponseSendStatus = async(req, res, body) => {
    const responseFromDB= await makeDBCall(body);

    return responseFromDB ? res.sendStatus(204) : res.sendStatus(500, "DB error")
}
*/

// TODO: if user opens a media property to rate or review, create document(s) for that.

// TODO: if user opens a media property to rate or review, but does not do so, ensure that no empty document stagnates in the database.
