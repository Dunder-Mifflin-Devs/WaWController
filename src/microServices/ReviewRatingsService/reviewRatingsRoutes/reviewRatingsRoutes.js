const express= require('express');
const router= express.Router();
const msController= require('../reviewRatingsControllers/reviewsController');
// const ensureAuth= require('pathToAuthFileHere')

// In these routes you will call the controller for the microservice

// POST routes
router.post('/:id/rating/:rating', msController.postRating) //5 star 
router.post('/:id', msController.postReview) //review text

// GET routes

// DELETE routes

// PUT routes

module.exports= router