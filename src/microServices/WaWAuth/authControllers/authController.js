const passport = require("passport");
const express = require("express");
const validator = require("validator");
const User = require("../../WaWuserManagement/UserModels/User");
const httpErrors = require("http-errors");
const session = require("express-session");

module.exports = {
  auth: (req, res) => {},
  logout: (req, res) => {
    if (req.isAuthenticated()) {
      try {
        req.session.destroy();
        res.status(200);
      } catch (err) {
        res.status(503);
      }
    } else {
      res.status(400);
    }
  },
};
