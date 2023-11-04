const createError= require('http-errors');
const Rating = require("../reviewRatingsModels/reviewRatingsModels");

// Reviews Controller for fetching and posting to database
module.exports = {
    postRating: async (req, res) => {
        //logic to post a rating goes here
        const dbCallBody= {
            rating: req.params.rating,
            id: req.params.id
        }
        verifyDbResponseSendStatus(req, res, dbCallBody)
    }, 

    postReview: async (req, res) => {
        //logic to post a review goes here
        const dbCallBody = {
            id: req.params.id,
            review: req.body.review,
        }

        verifyDbResponseSendStatus(req, res, dbCallBody)
    },

    putRating: async (req, res) => {
        try {
            const dbCallBody = {
                _id: req.params.id,
                userId: req.user._id
            };

            const dbUpdate = {
                rating: req.body.rating || undefined,
                review: req.body.review || undefined,
                timestamp: Date.now()
            };

            let result = Rating.updateOne(dbCallBody, dbUpdate);

            if (result.matchedCount === 0) {
                if (res) res.status(404).json({ success: false, message: 'Rating not found' });
                return { success: false, message: 'Rating not found' };
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
const verifyDbResponseSendStatus = async(req, res, body) => {
    const responseFromDB= await makeDBCall(body);

    return responseFromDB ? res.sendStatus(204) : res.sendStatus(500, "DB error")
}