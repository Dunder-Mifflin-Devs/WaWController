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

// =======
const mongoose = require('mongoose');
require('dotenv').config({ path: '/../../config/.env' });

const router = express.Router();

const UserSchema = require('../UserModels/User');

const User = mongoose.model('User', UserSchema);

// Define the OAuth 2.0 strategy
passport.use(new OAuth2Strategy(
  {
    authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenURL: 'https://oauth2.googleapis.com/token',
    clientID: '259520590873-88gpvkki15tgs1oadm118hnkmq3ojlr8.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5173/auth/google/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    // Here, you can perform actions after a successful authentication,
    // like fetching user data and saving it to a database.
    // 'profile' may contain user information returned by the OAuth provider.
    User.findOrCreate({ exampleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
)
);

// OAuth 2.0 authentication route
router.get('/auth', passport.authenticate('oauth2', { scope: ['profile', 'email'] }));

// OAuth 2.0 callback route
router.get(
  '/auth/google/callback',
  passport.authenticate('oauth2', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

// Define the protected routes
router.get('/profile', (req, res) => {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    res.send('Welcome to the Profile Page');
  } else {
    res.redirect('/');
  }
});

// POST: Create a new user profile
router.post('/', isAuthenticated, (req, res) => {
  const { username, email } = req.body;

  // Create a new user document
  const newUser = new User({
    username,
    email,
    // Other user profile data
  });

  // Save the new user document to the database
  newUser.save((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating user profile', error: err.message });
    }
    res.status(201).json({
      message: 'Profile created successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        // Other user profile data
      },
    });
  });
});

// PUT: Update an existing user profile
router.put('/', isAuthenticated, (req, res) => {
  const { username, email } = req.body;

  // Update the user data in the database
  User.findByIdAndUpdate(
    req.user._id, // Replace with the actual way to identify the user in your database
    { username, email }, // Update fields
    { new: true },
    (err, updatedUser) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating user data', error: err.message });
      }

      res.json({
        message: 'Profile settings updated successfully',
        user: updatedUser,
      });
    }
  );
});


module.exports = router;