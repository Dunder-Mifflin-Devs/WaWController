const passport = require("passport");
const validator = require("validator");
const User = require("../UserModels/User");
const Profile = require("../UserModels/Profile");
const bcrypt = require("bcrypt");
const { MongoClient } = require('mongodb');
const mongoose = require("mongoose");
const { validateRequestData } = require("../utils/utils");

module.exports = {
  //POST logic
  postSignup: async (req, res) => {
    req.body.email = req.body.email || "";
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
      passHash: bcrypt.hashSync(req.body.password, 10),
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

  postProfile: async (req, res) => {
    validateRequestData(req.body, [], "[insert fields here] are required");

    console.log(req.user);
    try {
      const profile = new Profile({
        _id: new mongoose.Types.ObjectId(),
        userId: req.user._id,
        langPref: req.body.langPref,
        favoriteGenres: req.body.favoriteGenres,
        favoriteMedia: req.body.favoriteMedia,
        watchedMedia: req.body.watchedMedia,
        toWatchMedia: req.body.toWatchMedia,
        userTags: req.body.userTags,
        userFriends: req.body.userFriends
      });
  
      let existingProfile = await Profile.findOne({ userId: req.body.userid })
      if (existingProfile) {
        /*
        req.flash("errors", {
          msg: "Profile for the user already exists",
        });
        */
        if (res) res.status(409).send({ msg: "Profile for the user already exists" })
        return { msg: "Profile for the user already exists" };
      }
  
      await profile.save();
      if (res) res.status(201).send({ msg: "Profile created" })
      return { msg: "Profile created" };
    }
    catch(err) {
      console.error(err);
      if (res) res.status(400).send({ msg: "Failed to create profile" })
      return { msg: "Failed to create profile" };
    }
  },

  postUserRating: (req, res) => {
    validateRequestData(req, res, ['userId', 'rating'], 'Both userId and rating are required.');

    if (req.isAuthenticated()) {
      res.json({ message: 'Authorized' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  },

  postAccountDelete: async (req, res) => {
    validateRequestData(req, res, ['userId'], 'userId is required.');

    const { userId } = req.body; //replace with logged in user

    if (req.isAuthenticated()) {
      res.json({ message: 'Authorized' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }

    try {

      let result = await User.deleteOne({ _id: userId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ msg: 'User not found.' });
      }

      await Profile.deleteOne({ userId });

      res.json({ message: 'User account deleted successfully' });
    } catch (error) {
      console.error('Error deleting user account:', error);
      res.status(500).json({ msg: 'An error occurred while deleting the user account.' });
    }
  },

  /*
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
  */

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

  getProfile: async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const profile = await Profile.findOne({ userId: req.user._id });
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found.' });
      }
      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error fetching profile data' });
    }
  },
  //DELETE logic

  //PUT logic

  putUser: async (req, res) => {
    try {
      delete req.body._id;
      delete req.body.passHash;
      delete req.body.userEmail;

      let result = await User.updateOne({ _id: req.user._id }, req.body);

      if (result.matchedCount === 0) {
        if (res) res.status(404).json({ error: 'User not found.' });
        return { error: 'User not found.' };
      }

      if (res) res.status(201).json({ msg: "User updated successfully" });
      return { msg: "User updated successfully" };

    }
    catch(err) {
      console.error(err);
      if (res) res.status(400).send({ msg: "Failed to update user" });
      return { msg: "Failed to update user" };
    }
  },

  putProfile: async (req, res) => {
    try {
      delete req.body._id;
      delete req.body.userId;

      let result = await Profile.updateOne({ userId: req.user._id }, req.body);

      if (result.matchedCount === 0) {
        if (res) res.status(404).json({ error: 'Profile not found.' });
        return { error: 'Profile not found.' };
      }

      if (res) res.status(201).json({ msg: "Profile updated successfully" });
      return { msg: "Profile updated successfully" };

    }
    catch(err) {
      console.error(err);
      if (res) res.status(400).send({ msg: "Failed to update profile" });
      return { msg: "Failed to update profile" };
    }
  },

  putUserRating: async (req, res) => {
    validateRequestData(req, res, ['userId', 'rating'], 'Both userId and rating are required.');

    const { userId, rating } = req.body;

    if (req.isAuthenticated()) {
      updateUserData(userId, 'rating', rating, res);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  },
}