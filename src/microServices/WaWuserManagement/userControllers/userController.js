const express = require('express');
const passport = require("passport");
const validator = require("validator");
const User = require("../userModels/User");
const { MongoClient } = require('mongodb');
const mongoose = require("mongoose")

const url = 'mongodb://localhost:27017';
const dbName = 'WaW-db';
const client = new MongoClient(url);

//Reuseable function for validating request data
function validateRequestData(req, res, requiredFields, errorMessage) {
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: errorMessage });
    }
  }
}

// Reusable function to update user data in MongoDB
async function updateUserData(userId, updateField, updateValue, res) {
  try {
    // Connect to the MongoDB database
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection('users');

    const updateQuery = { _id: userId };
    const update = { $set: { [updateField]: updateValue } };

    const result = await collection.updateOne(updateQuery, update);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: `User ${updateField} updated successfully` });
  } catch (error) {
    console.error(`Error updating user ${updateField}:`, error);
    res.status(500).json({ error: `An error occurred while updating the ${updateField}.` });
  } finally {
    // Close the MongoDB connection
    client.close();
  }
}

module.exports = {
  //POST logic
  postSignup: async (req, res) => {
    console.log(req.body)
    const validationErrors = [];
    if (!validator.isEmail(req.body.email))
      validationErrors.push({ msg: "Please enter a valid email address." });

    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.status(400).send({ msg: validationErrors.map(x => x.msg).join(', ') });
    }
    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      userName: req.body.userName,
      userEmail: req.body.email,
      passHash: req.body.password,
    });

    let existingUser = await User.findOne({ $or: [{ userEmail: req.body.email }, { userName: req.body.userName }] })
    if (existingUser) {
      req.flash("errors", {
        msg: "Account with that email address or username already exists.",
      });
      return res.status(409).send({ msg: "Account already exists" });
    }

    await user.save()
    return res.status(201).send({ msg: "Account created" })
  },

  postUserRating: (req, res) => {
    validateRequestData(req, res, ['userId', 'rating'], 'Both userId and rating are required.');

    if (req.isAuthenticated()) {
      res.json({ message: 'Authorized' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  },

  postUserProfilePicture: async (req, res) => {
    validateRequestData(req, res, ['userId', 'profilePicture'], 'Both userId and profilePicture are required.');

    const { userId, profilePicture } = req.body;

    if (req.isAuthenticated()) {
      res.json({ message: 'Authorized' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Connect to the MongoDB database
      await client.connect();

      const db = client.db(dbName);
      const collection = db.collection('users');

      // Update the user's profile picture in MongoDB
      const result = await collection.updateOne(
        { _id: userId }, // Assuming 'userId' is the document's _id
        { $set: { profilePicture } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }

      res.json({ message: 'User profile picture updated successfully' });
    } catch (error) {
      console.error('Error updating user profile picture:', error);
      res.status(500).json({ error: 'An error occurred while updating the profile picture.' });
    } finally {
      // Close the MongoDB connection
      client.close();
    }
  },


  postAccountEmail: async (req, res) => {
    validateRequestData(req, res, ['userId', 'email'], 'Both userId and email are required.');

    const { userId, email } = req.body;

    if (req.isAuthenticated()) {
      res.json({ message: 'Authorized' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Connect to the MongoDB database
      await client.connect();

      const db = client.db(dbName);
      const collection = db.collection('users');

      // Update the user's email in MongoDB
      const result = await collection.updateOne(
        { _id: userId }, // Assuming 'userId' is the document's _id
        { $set: { email } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }

      res.json({ message: 'User email updated successfully' });
    } catch (error) {
      console.error('Error updating user email:', error);
      res.status(500).json({ error: 'An error occurred while updating the email.' });
    } finally {
      // Close the MongoDB connection
      client.close();
    }
  },


  postAccountPassword: async (req, res) => {
    validateRequestData(req, res, ['userId', 'password'], 'Both userId and password are required.');

    const { userId, password } = req.body;

    if (req.isAuthenticated()) {
      res.json({ message: 'Authorized' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Connect to the MongoDB database
      await client.connect();

      const db = client.db(dbName);
      const collection = db.collection('users');

      // Update the user's password in MongoDB
      const result = await collection.updateOne(
        { _id: userId }, // Assuming 'userId' is the document's _id
        { $set: { password } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }

      res.json({ message: 'User password updated successfully' });
    } catch (error) {
      console.error('Error updating user password:', error);
      res.status(500).json({ error: 'An error occurred while updating the password.' });
    } finally {
      // Close the MongoDB connection
      client.close();
    }
  },

  postAccountUsername: async (req, res) => {
    validateRequestData(req, res, ['userId', 'username'], 'Both userId and username are required.');

    const { userId, username } = req.body;

    if (req.isAuthenticated()) {
      res.json({ message: 'Authorized' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Connect to the MongoDB database
      await client.connect();

      const db = client.db(dbName);
      const collection = db.collection('users');

      // Update the user's username in MongoDB
      const result = await collection.updateOne(
        { _id: userId }, // Assuming 'userId' is the document's _id
        { $set: { username } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }

      res.json({ message: 'User username updated successfully' });
    } catch (error) {
      console.error('Error updating user username:', error);
      res.status(500).json({ error: 'An error occurred while updating the username.' });
    } finally {
      // Close the MongoDB connection
      client.close();
    }
  },

  postAccountDelete: async (req, res) => {
    validateRequestData(req, res, ['userId'], 'userId is required.');

    const { userId } = req.body;

    if (req.isAuthenticated()) {
      res.json({ message: 'Authorized' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Connect to the MongoDB database
      await client.connect();

      const db = client.db(dbName);
      const collection = db.collection('users');

      // Delete the user with the provided userId in MongoDB
      const result = await collection.deleteOne({ _id: userId }); // Assuming 'userId' is the document's _id

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }

      res.json({ message: 'User account deleted successfully' });
    } catch (error) {
      console.error('Error deleting user account:', error);
      res.status(500).json({ error: 'An error occurred while deleting the user account.' });
    } finally {
      // Close the MongoDB connection
      client.close();
    }
  },

  postWatched: async (req, res) => {
    validateRequestData(req, res, ['userId', 'showId'], 'Both userId and showId are required.');

    const { userId, showId } = req.body;

    if (req.isAuthenticated()) {
      res.json({ message: 'Authorized' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Connect to the MongoDB database
      await client.connect();

      const db = client.db(dbName);
      const collection = db.collection('users');

      // Update the user's "watched" list by pushing the showId to an array
      const result = await collection.updateOne(
        { _id: userId }, // Assuming 'userId' is the document's _id
        { $addToSet: { watched: showId } } // Using $addToSet to ensure uniqueness
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }

      res.json({ message: 'Show marked as watched successfully' });
    } catch (error) {
      console.error('Error marking show as watched:', error);
      res.status(500).json({ error: 'An error occurred while marking the show as watched.' });
    } finally {
      // Close the MongoDB connection
      client.close();
    }
  },

  postWantToWatch: async (req, res) => {
    validateRequestData(req, res, ['userId', 'showId'], 'Both userId and showId are required.');

    const { userId, showId } = req.body;

    if (req.isAuthenticated()) {
      res.json({ message: 'Authorized' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Connect to the MongoDB database
      await client.connect();

      const db = client.db(dbName);
      const collection = db.collection('users');

      // Update the user's "wantToWatch" list by pushing the showId to an array
      const result = await collection.updateOne(
        { _id: userId }, // Assuming 'userId' is the document's _id
        { $addToSet: { wantToWatch: showId } } // Using $addToSet to ensure uniqueness
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }

      res.json({ message: 'Show marked as "want to watch" successfully' });
    } catch (error) {
      console.error('Error marking show as "want to watch":', error);
      res.status(500).json({ error: 'An error occurred while marking the show as "want to watch".' });
    } finally {
      // Close the MongoDB connection
      client.close();
    }
  },

  oAuthPost: (req, res) => {
    passport.use(new OAuth2Strategy(
      {
        authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenURL: 'https://oauth2.googleapis.com/token',
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
  },

  //GET logic

  oAuthGet: (req, res) => {
    passport.authenticate('oauth2', { scope: ['profile', 'email'] });
  },

  oAuthCallback: (req, res) => {
    passport.authenticate('oauth2', { failureRedirect: '/' })(req, res, () => {
      // Successful authentication; redirect or respond as needed
      res.redirect('/profile'); // You can replace this with your desired route
    });
  },

  getProfile: (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ message: 'Welcome to the Profile Page' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  },
  //DELETE logic

  //PUT logic

  putUserRating: async (req, res) => {
    validateRequestData(req, res, ['userId', 'rating'], 'Both userId and rating are required.');

    const { userId, rating } = req.body;

    if (req.isAuthenticated()) {
      updateUserData(userId, 'rating', rating, res);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  },

  putUserProfilePicture: async (req, res) => {
    validateRequestData(req, res, ['userId', 'profilePicture'], 'Both userId and profilePicture are required.');

    const { userId, profilePicture } = req.body;

    if (req.isAuthenticated()) {
      updateUserData(userId, 'profilePicture', profilePicture, res);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  },

  putAccountEmail: async (req, res) => {
    validateRequestData(req, res, ['userId', 'email'], 'Both userId and email are required.');

    const { userId, email } = req.body;

    if (req.isAuthenticated()) {
      updateUserData(userId, 'email', email, res);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  },

  putAccountPassword: async (req, res) => {
    validateRequestData(req, res, ['userId', 'password'], 'Both userId and password are required.');

    const { userId, password } = req.body;

    if (req.isAuthenticated()) {
      updateUserData(userId, 'password', password, res);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  },

  putAccountUsername: async (req, res) => {
    validateRequestData(req, res, ['userId', 'username'], 'Both userId and username are required.');

    const { userId, username } = req.body;

    if (req.isAuthenticated()) {
      updateUserData(userId, 'username', username, res);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  },

  putAccountDelete: async (req, res) => {
    validateRequestData(req, res, ['userId'], 'userId is required.');

    const { userId } = req.body;

    if (req.isAuthenticated()) {
      updateUserData(userId, res);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  },
}

/* Assuming we need to point to the routes from here */