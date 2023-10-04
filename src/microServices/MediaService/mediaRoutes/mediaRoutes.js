const express= require('express');
const router= express.Router();
const msController= require('../mediaControllers/mediaControllers')


// POST routes

// GET routes
router.get('/:id', msController.getShowById)
// DELETE routes

// PUT routes

module.exports= router;