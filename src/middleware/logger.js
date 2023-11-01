const express = require('express');
const winston = require('winston');
const app = express();

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'connection.log' }),
    ],
});

// Custom middleware to log connection attempts using Winston
app.use((req, res, next) => {
    const remoteAddress = req.connection.remoteAddress;
    logger.info(`Connection attempt from ${remoteAddress}`);
    next();
});