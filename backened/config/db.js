const mongoose = require('mongoose');
const winston = require('winston');

// Configure Winston logger for database errors
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log' }),
        new winston.transports.Console(), // Log to console for development
    ],
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10, // Connection pooling for scalability
            serverSelectionTimeoutMS: 5000, // Timeout for server selection
            socketTimeoutMS: 45000, // Timeout for socket inactivity
        });
        console.log('MongoDB connected successfully');

        // Ensure indexes are created
        mongoose.model('Student').createIndexes();
        mongoose.model('Fee').createIndexes();
    } catch (error) {
        logger.error('MongoDB connection error', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
        });
        process.exit(1); // Exit process on connection failure
    }
};

module.exports = connectDB;
