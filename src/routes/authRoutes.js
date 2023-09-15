const express = require('express');
const router = express.Router();
const logoutService = require('../services/wawUserManagement/logoutService');

router.get('/logout', (req, res) => {
    logoutService.performLogout(req, res);  
    
});

module.exports = router;