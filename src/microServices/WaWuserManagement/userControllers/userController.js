/* Assuming we need to point to the routes from here */

const User = require('../../../models/User');
const mongoose = require('mongoose');

// @desc    Get user profile
// @route   GET /user/profile
// @access  Private
const getUserProfile = async (req, res) => {
    // Get current logged in user's id, pic, username, and email
    try {
        const user = {
            _id: req.user._id,
            profPic: req.user.profPic,
            userName: req.user.userName,
            userEmail: req.user.userEmail,
        };
    
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: 'User not found' });
        console.log(err);
    }
    
};

// @desc    Delete user profile
// @route   DELETE /user/delete/:id
// @access  Private
const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user._id });
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
        console.log(err);
    }
};

module.exports = {
    getUserProfile,
    deleteUserProfile,
};