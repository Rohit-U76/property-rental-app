const mongoose = require('mongoose');

/**
 * Connect to MongoDB Database
 */
const connectDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');

    // In Mongoose 6+, useNewUrlParser and useUnifiedTopology are ALWAYS true by default.
    // Removing them fixes the "not supported" error.
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDatabase;