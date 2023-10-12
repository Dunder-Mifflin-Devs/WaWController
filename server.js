const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const props = require('./config/props');

const mongoose = require("mongoose");
const passport = require("passport");
console.log("anything please")
const session = require("express-session");
const MongoStore = require("connect-mongo");

const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
require('dotenv').config({ path: "./config/.env" });

const PORT = process.env.PORT || 3000;

// Passport config
require("./config/passport")(passport);

console.log("got to line 20")

//Connect To Database
connectDB();

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

console.log("got to line 29")

//Use forms for put / delete
app.use(methodOverride("_method"));

console.log("got to line 34")

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ client: mongoose.connection.getClient()}),
  })
);




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