const express = require('express');
const passport = require('passport');
// const OAuth2Strategy = require('passport-oauth2').Strategy;
const router = express.Router();
require('dotenv').config({ path: '/../../config/.env' });
const controller = require('../userControllers/userController')

// POST routes
router.post('/signUp', controller.postSignup)
// router.post('/signup/Oauth', controller.oAuthPost)
// router.post('/profile', controller.postProfile)

// GET routes 
// router.get('/oAuth', controller.oAuthGet);

//DELETE routes

// PUT routes
// router.put('/', controller.putProfile);

module.exports= router;