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


/* TODO wide open routes go here*/
const userMgmtRoutes = require("./src/microServices/WaWuserManagement/userRoutes/index");
app.use("/usermgmt", userMgmtRoutes);
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


// And... start it up!
app.listen(port, () => {
  console.log(`Running in a ${props.env} environment`);
  console.log(`Server is running in port ${port}.`);
});
