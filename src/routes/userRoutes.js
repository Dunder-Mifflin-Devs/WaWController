const express = require('express');
const router = express.Router();
const userController = require('../services/wawUserManagement/userController');

/* POST routes */
router.post('/logout', userController.logout);

/* GET routes */


/* PUT routes */


/* DELETE routes */