const passport = require("passport");
const validator = require("validator");
const User = require("../UserModels/User");
const Profile = require("../UserModels/Profile");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
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
      return res
        .status(400)
        .send({ msg: validationErrors.map((x) => x.msg).join(", ") });
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

    let existingUser = await User.findOne({
      $or: [{ userEmail: req.body.email }, { userName: req.body.userName }],
    });
    if (existingUser) {
      req.flash("errors", {
        msg: "Account with that email address or username already exists.",
      });
      return res.status(409).send({ msg: "Account already exists" });
    }

    await user.save();
    return res.status(201).send({ msg: "Account created" });
  },

  postProfile: async (req, res) => {
    let validationRes = validateRequestData(
      req.body,
      ["langPref"],
      "field langPref is required"
    );
    if (validationRes) {
      if (res)
        res.status(400).json({ success: false, message: validationRes.error });
      return { success: false, message: validationRes.error };
    }

    try {
      let existingProfile = await Profile.findOne({ userId: req.user._id });
      if (existingProfile) {
        if (res)
          res
            .status(409)
            .json({
              success: false,
              message: "Profile for the user already exists",
            });
        return {
          success: false,
          message: "Profile for the user already exists",
        };
      }

      await Profile.create({
        _id: new mongoose.Types.ObjectId(),
        userId: req.user._id,
        langPref: req.body.langPref,
        favoriteGenres: req.body.favoriteGenres,
        favoriteMedia: req.body.favoriteMedia,
        watchedMedia: req.body.watchedMedia,
        toWatchMedia: req.body.toWatchMedia,
        userTags: req.body.userTags,
        userFriends: req.body.userFriends,
      });
      if (res)
        res.status(201).json({ success: true, message: "Profile created" });
      return { success: true, message: "Profile created" };
    } catch (err) {
      console.error(err);
      if (res)
        res
          .status(400)
          .json({ success: false, message: "Failed to create profile" });
      return { success: false, message: "Failed to create profile" };
    }
  },

  postUserRating: (req, res) => {
    validateRequestData(
      req,
      res,
      ["userId", "rating"],
      "Both userId and rating are required."
    );

    if (req.isAuthenticated()) {
      res.json({ message: "Authorized" });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  },

  //GET logic

  oAuthGet: (req, res) => {
    passport.authenticate("oauth2", { scope: ["profile", "email"] });
  },

  oAuthCallback: (req, res) => {
    passport.authenticate("oauth2", { failureRedirect: "/" })(req, res, () => {
      res.redirect("/profile");
    });
  },

  getProfile: async (req, res) => {
    if (!req.isAuthenticated()) {
      if (res) res.status(401).json({ error: "Unauthorized" });
      return { error: "Unauthorized" };
    }

    try {
      const profile = await Profile.findOne({ userId: req.user._id });
      if (!profile) {
        if (res) res.status(404).json({ error: "Profile not found." });
        return { error: "Profile not found." };
      }

      if (res) res.json(profile);
      return profile;
    } catch (err) {
      console.error(err);

      if (res) res.status(500).send({ message: "Error fetching profile data" });
      return { message: "Error fetching profile data" };
    }
  },

  //DELETE logic
  deleteUser: async (req, res) => {
    try {
      let result = await User.deleteOne({ _id: req.user._id });
      if (result.deletedCount === 0) {
        if (res)
          res.status(409).json({ success: false, message: "User not found" });
        return { success: false, message: "User not found" };
      }

      await Profile.deleteOne({ userId: req.user._id });

      if (res)
        res
          .status(200)
          .json({
            success: true,
            message: "User account deleted successfully",
          });
      return { success: true, message: "User account deleted successfully" };
    } catch (error) {
      console.error("Error deleting user account:", error);
      if (res)
        res
          .status(500)
          .json({
            success: false,
            message: "An error occurred while deleting the user account.",
          });
      return {
        success: false,
        message: "An error occurred while deleting the user account.",
      };
    }
  },

  deleteProfile: async (req, res) => {
    try {
      let result = await Profile.deleteOne({ userId: req.user._id });
      if (result.deletedCount === 0) {
        if (res)
          res
            .status(409)
            .json({
              success: false,
              message: "No profile exists for the user",
            });
        return { success: false, message: "No profile exists for the user" };
      }

      if (res)
        res.status(200).json({ success: true, message: "Profile deleted" });
      return { success: true, message: "Profile deleted" };
    } catch (err) {
      console.error(err);
      if (res)
        res
          .status(500)
          .json({
            success: false,
            message: "Error while deleting profile data",
          });
      return { success: false, message: "Error while deleting profile data" };
    }
  },

  //PUT logic

  putUser: async (req, res) => {
    try {
      delete req.body._id;
      delete req.body.passHash;
      delete req.body.userEmail;

      let result = await User.updateOne({ _id: req.user._id }, req.body);

      if (result.matchedCount === 0) {
        if (res) res.status(404).json({ error: "User not found." });
        return { error: "User not found." };
      }

      if (res) res.status(201).json({ msg: "User updated successfully" });
      return { msg: "User updated successfully" };
    } catch (err) {
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
        if (res)
          res
            .status(404)
            .json({ success: false, message: "Profile not found." });
        return { success: false, message: "Profile not found." };
      }

      if (res)
        res
          .status(201)
          .json({ success: true, message: "Profile updated successfully" });
      return { success: true, message: "Profile updated successfully" };
    } catch (err) {
      console.error(err);
      if (res)
        res
          .status(400)
          .send({ success: false, message: "Failed to update profile" });
      return { success: false, message: "Failed to update profile" };
    }
  },

  putUserRating: async (req, res) => {
    validateRequestData(
      req,
      res,
      ["userId", "rating"],
      "Both userId and rating are required."
    );

    const { userId, rating } = req.body;

    if (req.isAuthenticated()) {
      updateUserData(userId, "rating", rating, res);
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  },
};
