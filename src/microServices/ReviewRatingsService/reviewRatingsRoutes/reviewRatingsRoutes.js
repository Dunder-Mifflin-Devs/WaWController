const express = require("express");
const rController = require("../reviewRatingsControllers/reviewsController");
// const ensureAuth= require('pathToAuthFileHere')

module.exports = (passport) => {
  const router = express.Router();

  // POST routes
  router.post(
    "/:mediaId/rating/:rating",
    passport.authenticate("local"),
    rController.postRating
  );
  router.post(
    "/:mediaId/review/:review",
    passport.authenticate("local"),
    rController.postReview
  );

  // GET routes
  router.get("/:mediaId/rating", rController.getAverageRating);
  router.get("/:mediaId/:page", rController.getReviews);
  router.get(
    "/:mediaId",
    passport.authenticate("local"),
    rController.getReviewRating
  );

  // DELETE routes
  router.delete(
    "/:mediaId",
    passport.authenticate("local"),
    rController.deleteReviewRating
  );

  // PUT routes
  router.put(
    "/:mediaId",
    passport.authenticate("local"),
    rController.putReviewRating
  );

  return router;
};
