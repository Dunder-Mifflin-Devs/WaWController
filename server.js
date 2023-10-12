const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const props = require('./config/props');
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
require('dotenv').config({ path: "./config/.env" });
// Passport config
require("./config/passport")(passport);


//Connect To Database
connectDB();

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));


//Use forms for put / delete
app.use(methodOverride("_method"));


// Setup Sessions - stored in MongoDB

const mongoClientPromise = new Promise((resolve) => {
  mongoose.connection.on("connected", () => {
      const client = mongoose.connection.getClient();
      resolve(client);
  });
});

const sessionStore = MongoStore.create({
  clientPromise: mongoClientPromise,
  collection: "sessions"
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));



// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, etc...
app.use(flash());

/* TODO wide open routes go here*/



/* TODO Passport authentication logic goes here*/
const OAuth2Strategy = require('passport-oauth2');

passport.use(new OAuth2Strategy({
  authorizationURL: process.env.authorizationURL,
  tokenURL: process.env.tokenURL,
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: process.env.callbackURL,
  scope: ['profile', 'email']
},
function(accessToken, refreshToken, profile, cb) {
  //From AI
  // Typically, you'd find or create a user in your database here
  // For this example, just pass the profile data forward
  return cb(null, profile);
}));

/* TODO secure routes go here*/

app.get('/auth', passport.authenticate('oauth2'));

app.get('/auth/callback', 
  passport.authenticate('oauth2', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

/* TODO Ensure Auth */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/auth');
}

app.get('/protected', ensureAuthenticated, (req, res) => {
  res.send('Protected content!');
});

/* TODO passport oauth routh authentication */




// And... start it up!
app.listen(port, () => {
    console.log(`Running in a ${props.env} environment`);
    console.log(`Server is running in port ${port}.`);
});