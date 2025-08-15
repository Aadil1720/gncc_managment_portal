
const { ApiError } = require('../utils/errors');
const winston = require('winston');
const multer=require('multer')

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [new winston.transports.File({ filename: 'error.log' })],
});

const errorHandler = (err, req, res, next) => {
    // Log the error
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Handle known API errors
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
        return res.status(400).json({ error: 'Student with this name already exists' });
    }

    // Handle invalid MongoDB ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid player ID' });
    }

       if (err instanceof multer.MulterError || err.message.includes('Invalid file type')) {
        return res.status(400).json({ error: err.message });
    }
    // Default to server error
    res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;