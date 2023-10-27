const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" })
const GoogleStrategy = require('passport-oauth2').Strategy
const User = require("../src/microServices/WaWuserManagement/userModels/User");

module.exports = function(passport, label) {
    passport.use(label,
    new GoogleStrategy({
        authorizationURL: process.env.AUTHORIZATION_URL,
        tokenURL: process.env.TOKEN_URL,
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value
            }

            try {
                let user = await User.findOne({ googleId: profile.id })
                
                if (user) {
                    done(null, user)
                }
                else {
                    user = await User.create(newUser)
                    done(null, user)
                }
            }
            catch (err) {
                console.log(err)
            }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) =>  done(err, user))
    })
    
}


// If you can't set up Oauth at http://locahost:PORT/auth/google/callback...
// Try http://127.0.0.1:PORT/auth....

