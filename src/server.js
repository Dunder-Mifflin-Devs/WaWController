const express = require("express");
const app = express();
const yn = require('yn');
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const path = require("path")

const connectDB = require("./config/database");
const mainRoutes = require('./routes/main')

//Use .env file in config folder 
console.log("connected to " + process.env.ENV + " environment")

const PORT = process.env.PORT || 3000;

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
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/" }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);

// Enable CORS for client origin only
const cors = require('cors')
const corsOptions = {
   origin : ['http://127.0.0.1:3000', 'https://127.0.0.1:3000'],
}
app.use(cors(corsOptions))

// sets up local mongo server if necessary
// can't seem to figure out how to set cross-env to work with dotenv. Should work with npm run devLocal, but it stops accessing the .env file
const dbString = process.env.DB_STRING || ''
if (dbString.includes('localhost') || dbString.includes('127.0.0.1')) {
  const { run } = require("./dev-mongo");
  (async function() {
    await run()
  })()
}

// Check if in a local environment
const isMockEnvironment = yn(process.env.ENVIRONMENT === 'local');

let dbUrl;
if (isMockEnvironment) {
    // If in mock env, use mock DB
    dbUrl = process.env.MOCK_DB_URL;
} else {
    // Else use live DB
    dbUrl = process.env.LIVE_DB_URL;
}

//Connect To Database
connectDB().then(() => {
  //Server Running
  app.listen(PORT, () => {
    console.log(
      `Server is running on ${PORT}, you better catch it!`
    );
  });
});
module.exports = app