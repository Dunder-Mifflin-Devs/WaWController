const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const props = require('../../config/props');
const User = require('../models/userModel');

require('dotenv').config({ path: '/../config/.env' });



const conn = await mongoose.connect(props.dbUrl || "mongodb://127.0.0.1:27017/", { //necessary for tests
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Reusable validation middleware
const validateUser = [
    isAuthenticated,
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
];

// Custom error handling middleware for specific routes
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
    }
    next(); // Proceed to the next middleware or route handler
};

// POST: Create a new user profile
router.post('/', validateUser, handleValidationErrors, (req, res) => {
    const { username, email } = req.body;

    // Create a new user document using the User model
    const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        email,
        // Other user profile data
    });

    // Save the new user document to the database
    newUser.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating user profile', error: err.message });
        }
        res.status(201).json({
            message: 'Profile created successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                // Other user profile data
            },
        });
    });
});

// PUT: Update an existing user profile
router.put('/', validateUser, handleValidationErrors, (req, res) => {
    const { username, email } = req.body;

    // Update the user data in the database
    User.findByIdAndUpdate(
        req.user._id,
        { username, email },
        { new: true },
        (err, updatedUser) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating user data', error: err.message });
            }

            res.json({
                message: 'Profile settings updated successfully',
                user: updatedUser,
            });
        }
    );
});

module.exports = router;