const mongoose = require('mongoose');

mongoose.set('debug', true);

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://arsath02062004:rSfm7X1yCwmVb1E6@users.rpxr6.mongodb.net/?retryWrites=true&w=majority&appName=users', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;