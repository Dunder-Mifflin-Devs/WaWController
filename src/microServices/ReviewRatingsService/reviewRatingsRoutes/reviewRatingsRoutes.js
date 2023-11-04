const express= require('express');
const rController= require('../reviewRatingsControllers/reviewsController');
// const ensureAuth= require('pathToAuthFileHere')

// In these routes you will call the controller for the microservice

module.exports = (passport) => {
    const router= express.Router();

    // POST routes
    router.post('/:id/rating/:rating', passport.authenticate("local"), rController.postRating) //5 star 
    router.post('/:id', passport.authenticate("local"), rController.postReview) //review text

    // GET routes

    // DELETE routes

    // PUT routes
    router.put("/:id", passport.authenticate("local"), rController.putRating); // update review/rating

    return router;
}