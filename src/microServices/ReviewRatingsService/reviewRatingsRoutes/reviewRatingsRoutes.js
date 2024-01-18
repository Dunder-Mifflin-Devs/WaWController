const express= require('express');
const rController= require('../reviewRatingsControllers/reviewsController');
// const ensureAuth= require('pathToAuthFileHere')

// In these routes you will call the controller for the microservice

module.exports = (passport) => {
    const router= express.Router();

    // POST routes
    router.post('/:mediaId/rating/:rating', passport.authenticate("local"), rController.postRating) //5 star type rating sent to DB for logged in user
    router.post('/:mediaId/review/:review', passport.authenticate("local"), rController.postReview) //review text

    // GET routes
    router.get("/:mediaId/rating", rController.getAverageRating);
    router.get("/:mediaId/:page", rController.getReviews);
    router.get("/:mediaId", passport.authenticate("local"), rController.getReviewRating);

    // DELETE routes
    router.delete("/:mediaId", passport.authenticate("local"), rController.deleteReviewRating);

    // PUT routes
    router.put("/:mediaId", passport.authenticate("local"), rController.putReviewRating); // update review/rating

    return router;
}