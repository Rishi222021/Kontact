const mongoose = require('mongoose');
require('colors');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        
        if (!mongoURI || mongoURI.includes('your_mongodb_atlas')) {
            console.error('ERROR: MONGO_URI is missing or has placeholder value in .env file.'.red.bold);
            console.log('Please update the MONGO_URI in your root .env file with your MongoDB connection string.'.yellow);
            process.exit(1);
        }

        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`.red.bold);
        process.exit(1);
    }
};

module.exports = connectDB;
