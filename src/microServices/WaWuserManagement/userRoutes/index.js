const express = require("express");

require("dotenv").config({ path: "/../../config/.env" });
const controller = require("../userControllers/userController");
const { ensureAuth } = require("../../../middleware/middleware");

module.exports = (passport) => {
  const router = express.Router();

  // Protect OAuth authentication routes using the OAuth Passport module
  router.get("/oauth-login", passport.authenticate("oauth2"), (req, res) => {
    // OAuth login route logic goes here, protected by Passport OAuth strategy
  });

  // Protect Local authentication routes using the Local Passport module
  router.post("/local-login", passport.authenticate("local"), (req, res) => {
    return res.status(200).send();
  });

  passport.authenticate();

  //router.post('/signup/Oauth', controller.oAuthPost)
  router.post("/signup/email", controller.postSignup);
  router.post("/user-rating", controller.postUserRating);
  router.post(
    "/profile",
    passport.authenticate("local"),
    controller.postProfile
  );

  // GET routes
  router.get("/auth", controller.oAuthGet);

  //DELETE routes
  router.delete("/user", passport.authenticate("local"), controller.deleteUser);
  router.delete(
    "/profile",
    passport.authenticate("local"),
    controller.deleteProfile
  );

  // PUT routes
  router.put("/user-rating", controller.putUserRating);
  router.put("/user", passport.authenticate("local"), controller.putUser);
  router.put("/profile", passport.authenticate("local"), controller.putProfile);

  // OAuth 2.0 authentication route

  // OAuth 2.0 callback route
  router.get("/auth/google/callback", controller.oAuthCallback);

  // Protected route example
  router.get(
    "/profile",
    passport.authenticate("local"),
    ensureAuth,
    controller.getProfile
  );

  return router;
};
