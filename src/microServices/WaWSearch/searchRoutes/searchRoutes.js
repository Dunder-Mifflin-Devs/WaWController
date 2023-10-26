const express = require('express');

require('dotenv').config({ path: '/../../config/.env' });
const controller = require('../searchControllers/search')

module.exports = (passport) => {
  const router = express.Router();

  return router;
};