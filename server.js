const express = require("express");
const app = express();
const props = require("./config/props");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const { connectDB, run } = require("./config/database");
const cors = require("cors");
require("dotenv").config({ path: "./config/.env" });

//Create Database
if (props.dbUrl.includes("localhost") || props.dbUrl.includes("127.0.0.1")) {
  run(Number(process.env.MOCK_DB_PORT));
}

connectDB();

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

// // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require("./config/passport-local")(passport, "local");
process.env.AUTHORIZATION_URL &&
  require("./config/passport-oauth2")(passport, "oauth2");

app.use(flash());

//middleware routes
const middleware = require("./src/middleware/middleware");
//app.use(middleware.logger);

//cors enabled and described
const allowedOrigins = ['http://omdb.com', 'https://dmd-waw-dev.onrender.com/'];
// const allowedOrigins = ['*'];

// Configure CORS with allowed origins
app.use(cors({
  origin: function (origin, callback) {
    // Check if the origin is allowed or if it is undefined (for non-browser requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
// app.use(cors());

//microservice routes
const userMgmtRoutes =
  require("./src/microServices/WaWuserManagement/userRoutes/index")(passport);
app.use("/usermgmt", userMgmtRoutes);

const searchRoutes =
  require("./src/microServices/WaWSearch/searchRoutes/searchRoutes")(passport);
app.use("/search", searchRoutes);

const mediaRoutes =
  require("./src/microServices/MediaService/mediaRoutes/mediaRoutes")(passport);
app.use("/media", mediaRoutes);

const reviewRatingsRoutes =
  require("./src/microServices/ReviewRatingsService/reviewRatingsRoutes/reviewRatingsRoutes")(
    passport
  );
app.use("/reviews", reviewRatingsRoutes);

app.get(
  "/loginOauth",
  passport.authenticate("oauth2", {
    session: true,
    successReturnToOrRedirect: "/",
  })
);

// Google Auth consent screen route
app.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// Call back route
app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failed",
  }),
  function (req, res) {
    req.session.regenerate(function (err) {
      // will have a new session here to prevent session fixation atk
      res.redirect("/success");
    });
  }
);

module.exports = app.listen(props.port, () => {
  console.log(`Running in a ${props.env} environment`);
  console.log(`Server is running in port ${props.port}.`);

  if (props.env === "test") console.error = () => {};
  if (props.env === "production") console.log = () => {};
});
