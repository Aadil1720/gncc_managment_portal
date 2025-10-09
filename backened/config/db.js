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

    
        await mongoose.connect(process.env.MONGO_URI,{
            maxPoolSize: 10,
            minPoolSize: 5, // Added min pool size for better performance
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000, // Added connection timeout  
        });

        //Ensure indexes are created
        mongoose.model('Student').createIndexes();
        mongoose.model('Fee').createIndexes();
        
        console.log('✅ MongoDB connected successfully!');
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
