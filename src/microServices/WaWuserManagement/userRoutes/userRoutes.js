const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const router = express.Router();
require('dotenv').config({ path: '/../../config/.env' });
const controller = require('../userControllers/userController')

// POST routes
router.post('/signUp', controller.postSignup())
router.post('/signup/Oauth', controller.oAuthPost())


// GET routes 
router.get('/auth', controller.oAuthGet());

//DELETE routes

// PUT routes


// OAuth 2.0 authentication route


// OAuth 2.0 callback route
router.get('/auth/google/callback', oAuthCallback());


// Protected route example
router.get('/profile', getProfile(req, res)); 

module.exports = router;