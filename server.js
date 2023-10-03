const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const props = require('./config/props');
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
// const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
require('dotenv').config({ path: './config/.env' });

// Passport config
require("./config/passport")(passport);


//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//Connect To Database
connectDB();

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, etc...
app.use(flash());

/* TODO wide open routes go here*/



/* TODO Passport authentication logic goes here*/


/* TODO secure routes go here*/



// And... start it up!
app.listen(port, () => {
    console.log(`Running in a ${props.env} environment`);
    console.log(`Server is running in port ${port}.`);
});