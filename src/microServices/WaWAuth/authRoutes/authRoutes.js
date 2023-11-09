
const express = require('express');
const router = express.Router();
const authController = require('../authControllers/authController');

router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.post('/', authController.auth);
router.post

router.get("/logout", authController.logout);


module.exports = router;

//from here you will call the controller for the service



/*
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/feed", ensureAuth, postsController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);



module.exports = router;
*/

