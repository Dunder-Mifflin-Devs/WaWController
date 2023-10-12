const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const props = require("./config/props");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
require("dotenv").config({ path: "./config/.env" });
// Passport config
const LocalStrategy = require("passport-local").Strategy;
const OAuth2Strategy = require("passport-oauth2");

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
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, etc...
app.use(flash());

/* TODO Passport authentication logic goes here*/
//const OAuth2Strategy = require('passport-oauth2');

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: process.env.AUTHORIZATION_URL,
      tokenURL: process.env.TOKEN_URL,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
      //From AI
      // Typically, you'd find or create a user in your database here
      // For this example, just pass the profile data forward
      return cb(null, profile);
    }
  )
);

/* TODO wide open routes go here*/

/* TODO secure routes go here*/
app.get("/loginOauth", passport.authenticate("oauth2", {
  session: true,
  successReturnToOrRedirect: "/"
}))

// Google Auth consent screen route
app.get('/google',
    passport.authenticate('google', {
            scope:
                ['email', 'profile']
        }
));

// Call back route
app.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
    }),
    function (req, res) {
        res.redirect('/success')

    }
);
/* 
app.get("/auth/oauth2", passport.authenticate("oauth2"));

app.get(
  "/auth/oauth2/callback",
  passport.authenticate("oauth2", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
 */
/* TODO Ensure Auth */
/* function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/auth');
}

app.get('/protected', ensureAuthenticated, (req, res) => {
  res.send('Protected content!');
}); */

/* TODO passport oauth routh authentication */

// And... start it up!
app.listen(port, () => {
  console.log(`Running in a ${props.env} environment`);
  console.log(`Server is running in port ${port}.`);
});
