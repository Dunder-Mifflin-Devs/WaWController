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

    // DELETE routes

    // PUT routes
    router.put("/:id", passport.authenticate("local"), rController.putRating); // update review/rating

    return router;
}