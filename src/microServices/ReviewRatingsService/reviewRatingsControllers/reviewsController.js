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

            let result = await Rating.updateOne(dbCallBody, dbUpdate, { runValidators: true });

            if (result.matchedCount === 0) {
                if (res) res.status(404).json({ success: false, message: 'Review/rating not found' });
                return { success: false, message: 'Review/rating not found' };
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

    deleteReviewRating: async (req, res) => {
        let deleteType = req.body.delete || "";

        try {
            deleteType = deleteType.toLowerCase();
            if (deleteType !== "review" && deleteType !== "rating") {
                deleteType = "both"
            };

            const dbCallBody = {
                mediaId: req.params.mediaId,
                userId: req.user._id
            };
            const dbUpdateBody = {
                review: (deleteType !== "rating") ? null : undefined,
                rating: (deleteType !== "review") ? null : undefined,
                timestamp: Date.now()
            };

            let result = await Rating.updateOne(dbCallBody, dbUpdateBody);
            if (result.matchedCount === 0) {
                if (res) res.status(404).json({ success: false, message: 'Review/rating not found' });
                return { success: false, message: 'Review/rating not found' };
            }

            result = await Rating.findOne(dbCallBody);
            if (result.review === null && result.rating === null) {
                await Rating.deleteOne(dbCallBody);
            }

            if (res) res.status(200).json({ success: true, message: "Deleted review/rating"});
            return { success: true, message: "Deleted review/rating"};

        }
        catch(err) {
            console.error(err);
            if (res) res.status(500).json({ success: false, message: "Failed to delete review/rating" });
            return { success: false, message: "Failed to delete review/rating" };
        }
    },

    getReviews: async (req, res) => {
        let mediaId = req.params.mediaId;
        let page = req.params.page || 1;
        let pageSize = req.body.pageSize || 20;

        try {
            let results = await Rating.find({
                mediaId
            })
            .populate(userId).skip(page * pageSize).limit(pageSize);
            if (!results) {
                if (res) res.status(404).json({ success: false, message: "No media matches the given id" });
                return { success: false, message: "No media matches the given id" };
            }

            let count = await Rating.find({mediaId}).count();
            for (let result of results) {
                result.userId = result.userId.userName
            }

            if (res) res.json({ success: true, results, count });
            return { success: true, results, count };
        }
        catch(err) {
            console.error(err);
            if (res) res.status(500).json({ success: false, message: "Failed to find reviews"});
            return { success: false, message: "Failed to find reviews"};
        }
    },

    getAverageRating: async (req, res) => {
        let mediaId = req.params.mediaId;
        
        try {
            let result = await Media.findOne({ mediaId });

            if (!result) {
                if (res) res.status(404).json({ success: false, message: "No media found with the given id" });
                return { success: false, message: "No media found with the given id" };
            }

            let averageRating = result.totalRatings / result.numberOfRatings;
            if (res) res.json({ averageRating });
            return { averageRating };
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

