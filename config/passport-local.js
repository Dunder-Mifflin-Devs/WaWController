const LocalStrategy = require("passport-local").Strategy;
const User = require("../src/microServices/WaWuserManagement/UserModels/User");
const bcrypt = require("bcrypt");

module.exports = function (passport, label) {
  passport.use(
    label,
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ userEmail: email.toLowerCase() })
        .then((user) => {
          if (!user) {
            return done(null, false, { msg: `Email ${email} not found.` });
          }
          if (!user.passHash) {
            return done(null, false, {
              msg: "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
            });
          }

          bcrypt.compare(password, user.passHash, (err, isMatch) => {
            if (err) {
              return done(err);
            }
            if (isMatch) {
              return done(null, user);
            }
            return done(null, false, { msg: "Invalid email or password." });
          });
        })
        .catch((err) => {
          return done(err);
        });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((_id, done) => {
    User.findById(_id, (err, user) => done(err, user));
  });
};
