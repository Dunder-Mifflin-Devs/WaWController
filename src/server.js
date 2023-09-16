const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const passport = require('passport');
const session = require('express-session');
const props = require('../config/props');
const routes = require('./services/wawUserManagement/routes/routes.js');
require('dotenv').config({ path: './config/.env' });

// Configure Express session
app.use(session({ secret: 'super secret', resave: true, saveUninitialized: true }));

// Initialize Passport and use session for persistent login sessions
app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user sessions
passport.serializeUser((user, done) => {
    // Serialize user data to store in the session (e.g., user.id)
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    // Deserialize user data from the session (e.g., retrieve user by user.id)
    done(null, user);
  });

  app.use('/', routes);

app.listen(port, () => {
    console.log(`Running in a ${props.env} environment`);
    console.log(`Server is running in port ${port}.`);
});