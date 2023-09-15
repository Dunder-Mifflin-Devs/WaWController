const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const mongoose = require("mongoose")

exports.postSignup = async (req, res, next) => {
  console.log(req.body)
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.status(400).send(validationErrors.map(x => x.msg).join(', '));
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

  let existingUser = await User.findOne({ $or: [{ email: req.body.email }, { userName: req.body.userName }] })
  if (existingUser) {
    req.flash("errors", {
      msg: "Account with that email address or username already exists.",
    });
    return res.status(409).send("Account already exists");
  }

  await user.save()
  return res.status(201).send("Account created")  
};
