
const express = require('express');
const passport = require("passport");
const validator = require("validator");
const User = require("../userModels/User");
const mongoose = require("mongoose")

const validateUser = [
  isAuthenticated,
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
];

const conn = await mongoose.connect(props.dbUrl || "mongodb://127.0.0.1:27017/", { //necessary for tests
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
  }
  next(); // Proceed to the next middleware or route handler
}

module.exports = {
//POST logic
    postSignup : async (req, res, next) => {
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

    oAuthPost: (req, res) => {
        passport.use( new OAuth2Strategy(
            {
              authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
              tokenURL:'https://oauth2.googleapis.com/token',
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
    
    oAuthGet : (req, res) => {
        passport.authenticate('oauth2', { scope: ['profile', 'email'] })
    },

    oAuthCallback : (req, res) => {
        passport.authenticate('oauth2', { failureRedirect: '/' }),
        (req, res) => {
          // Successful authentication; redirect or respond as needed
          res.redirect('/profile'); // You can replace this with your desired route
        }      ;
    },

    getProfile : (req, res) => {
        // Check if the user is authenticated
        if (req.isAuthenticated()) {
          res.send('Welcome to the Profile Page');
        } else {
          res.redirect('/');
        }
      },

      postProfile: (req, res) => {
        validateUser, handleValidationErrors, (req, res) => {
        const { username, email } = req.body;

  // Create a new user document using the User model
        const newUser = new User({
         _id: new mongoose.Types.ObjectId(),
          username,
          email,
      // Other user profile data
        });
        newUser.save((err) => {
          if (err) {
              return res.status(500).json({ message: 'Error creating user profile', error: err.message });
          }
          res.sendStatus(201).json({
              message: 'Profile created successfully',
              user: {
                  id: newUser._id,
                  username: newUser.username,
                  email: newUser.email,
                  // Other user profile data
              },
          });
        });
      }
    },


    //DELETE logic

    //PUT logic
    putProfile: (req, res) => { validateUser, handleValidationErrors, (req, res) => {
      const { username, email } = req.body;
  
      // Update the user data in the database
      User.findByIdAndUpdate(
          req.user._id,
          { username, email },
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
  }}
}
