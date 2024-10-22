const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const turfRoutes = require('./routes/turfs');
const bookingRoutes = require('./routes/bookings');
const profileRoutes = require('./routes/profile');
const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhooks');
const cors = require('cors');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/turfs', turfRoutes);
app.use('/bookings', bookingRoutes);
app.use('/profile', profileRoutes);
app.use('/payment', paymentRoutes);
app.use('/webhooks', webhookRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});

