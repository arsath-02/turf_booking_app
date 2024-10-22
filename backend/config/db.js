const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected successfully');
    } catch (err) {
      console.error('Database connection error:', err);
      process.exit(1); // Exit the process on failure
    }
  };

module.exports = connectDB;
