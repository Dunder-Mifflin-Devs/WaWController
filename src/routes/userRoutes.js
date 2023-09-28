const express = require("express");
const router = express.Router();
const userController = require('../microServices/WaWuserManagement/userControllers/userController');

// GET User profile
router.get('/profile', userController.getUserProfile);

// DELETE User profile
router.delete('/delete/:id', userController.deleteUserProfile);

module.exports = router;