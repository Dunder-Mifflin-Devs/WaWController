const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;

require('dotenv').config({ path: '/../../config/.env' });

const router = express.Router();

// Define the OAuth 2.0 strategy
passport.use( new OAuth2Strategy(
    {
      authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenURL:'https://oauth2.googleapis.com/token',
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
    // Successful authentication; redirect or respond as needed
    res.redirect('/profile'); // You can replace this with your desired route
  }
);

// Protected route example
router.get('/profile', (req, res) => {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    res.send('Welcome to the Profile Page');
  } else {
    res.redirect('/');
  }
});

module.exports = router;