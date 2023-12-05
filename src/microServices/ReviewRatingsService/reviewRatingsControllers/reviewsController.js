const createError= require('http-errors');
const Rating = require("../reviewRatingsModels/reviewRatingsModels");
const Media = require("../../MediaService/mediaModels/mediaModels");

// Reviews Controller for fetching and posting to database
module.exports = {
    postRating: async (req, res) => {
        //logic to post a rating goes here
        const dbCallBody= {
            rating: req.params.rating,
            id: req.params.id
        }
        //verifyDbResponseSendStatus(req, res, dbCallBody)
    }, 

    postReview: async (req, res) => {
        //logic to post a review goes here
        const dbCallBody = {
            id: req.params.id,
            review: req.body.review,
        }

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
                timestamp: Date.now()
            };

            let oldReviewRating = await Rating.findOne(dbCallBody);
            let result = await Rating.updateOne(dbCallBody, dbUpdate, { runValidators: true });

            if (result.matchedCount === 0) {
                if (res) res.status(404).json({ success: false, message: 'Review/rating not found' });
                return { success: false, message: 'Review/rating not found' };
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
            if (res) res.status(500).json({ success: false, message: "Failed to update rating/review" });
            return { success: false, message: "Failed to update rating/review" };
        }
    },

    /*
    Gets the review and rating for a media by the logged in user
    */
    getReviewRating: async (req, res) => {
        try {
            const dbCallBody = {
                mediaId: req.params.mediaId,
                userId: req.user._id
            };

            let reviewRating = await Rating.findOne(dbCallBody);
            if (!reviewRating) {
                if (res) res.status(404).json({ success: false, message: "No existing rating or review from this user for this media" });
                return { success: false, message: "No existing rating or review from this user for this media" };
            }

            if (res) res.json(reviewRating);
            return reviewRating;
        }
        catch(err) {
            console.error(err);
            if (res) res.status(500).json({ success: false, message: "Failed to get rating/review" });
            return { success: false, message: "Failed to get rating/review" };
        }
    },

    /*
    Deletes either the review or rating and review for a media by the logged in user
    example body:
        delete: "review"
    */
    deleteReviewRating: async (req, res) => {
        let deleteType = req.body.delete || "";

        try {
            deleteType = deleteType.toLowerCase();
            if (deleteType !== "review") {
                deleteType = "both"
            };

            const dbCallBody = {
                mediaId: req.params.mediaId,
                userId: req.user._id
            };
            const dbUpdateBody = {
                review: null,
                rating: (deleteType !== "review") ? null : undefined,
                timestamp: Date.now()
            };

            let review = await Rating.findOne(dbCallBody);

            let result = await Rating.updateOne(dbCallBody, dbUpdateBody);
            if (result.matchedCount === 0) {
                if (res) res.status(404).json({ success: false, message: 'Review/rating not found' });
                return { success: false, message: 'Review/rating not found' };
            }

            if (deleteType !== "review") {
                await Rating.deleteOne(dbCallBody);
                await Media.updateOne({
                    imdbId: req.params.mediaId
                }, {
                    $inc: {
                        totalRatings: -review.rating,
                        numberOfRatings: -1
                    }
                });
            }

            if (res) res.status(200).json({ success: true, message: "Deleted review/rating"});
            return { success: true, message: "Deleted review/rating"};

        }
        catch(err) {
            console.log(err);
            console.error(err);
            if (res) res.status(500).json({ success: false, message: "Failed to delete review/rating" });
            return { success: false, message: "Failed to delete review/rating" };
        }
    },

    /*
    Gets a page of reviews for a media
    example query parameters:
        pageSize: 20
    */
    getReviews: async (req, res) => {
        let mediaId = req.params.mediaId;
        let page = req.params.page || 1;
        let pageSize = (req.query || {}).pageSize || 20;

        try {
            if (isNaN(page - 1)) throw "Invalid page given";

            let results = await Rating.find({
                mediaId
            })
            .populate("userId").skip((page - 1) * pageSize).limit(pageSize);

            let count = await Rating.countDocuments({ mediaId });
            results = results.map(x => {
                return {
                    _id: x._id,
                    userId: x.userId._id || x.userId,
                    userName: x.userId.userName,
                    mediaId: x.mediaId,
                    rating: x.rating,
                    review: x.review,
                    timestamp: x.timestamp
                }
            });

            if (res) res.json({ success: true, results, count });
            return { success: true, results, count };
        }
        catch(err) {
            console.error(err);
            if (res) res.status(500).json({ success: false, message: "Failed to find reviews"});
            return { success: false, message: "Failed to find reviews"};
        }
    },

    /*
    Gets the average rating and number of ratings for a given media
    */
    getAverageRating: async (req, res) => {
        let mediaId = req.params.mediaId;
        
        try {
            let result = await Media.findOne({ imdbId: mediaId });

            if (!result) {
                if (res) res.status(404).json({ success: false, message: "No media found with the given id" });
                return { success: false, message: "No media found with the given id" };
            }

            let averageRating = result.totalRatings / result.numberOfRatings;
            if (res) res.json({ averageRating, numberOfRatings: result.numberOfRatings });
            return { averageRating, numberOfRatings: result.numberOfRatings };
        }
        catch(err) {
            console.error(err);
            if (res) res.status(500).json({ success: false, message: "Failed to get average rating" });
            return { success: false, message: "Failed to get average rating" };
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

