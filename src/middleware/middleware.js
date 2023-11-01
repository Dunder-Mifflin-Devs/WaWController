const express = require('express');
const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'connection.log' }),
    ],
});

module.exports = {
    //Custom middleware to log connection attempts using Winston
    logger: (req, res, next) => {
        const remoteAddress = req.connection.remoteAddress;
        logger.info(`Connection attempt from ${remoteAddress}`);
        next();
    },
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            return next(httpErrors(403,"Please login"));
        }
      },
    ensureGuest: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            res.redirect("/profile");
        }
    },
}