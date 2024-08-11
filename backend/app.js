const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const turfRoutes = require('./routes/turfs');
const bookingRoutes = require('./routes/bookings');
const profileRoutes = require('./routes/profile');
const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhooks');
const ngrok = require('ngrok');
const cors = require('cors');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/turfs', turfRoutes);
app.use('/bookings', bookingRoutes);
app.use('/profile', profileRoutes);
app.use('/payment', paymentRoutes);
app.use('/webhooks', webhookRoutes);

const PORT = process.env.PORT || 3000;
const NGROK_SUBDOMAIN = 'active-mallard-uniquely.ngrok-free.app'; 

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});
    
    // ngrok
    /*try {
        await ngrok.authtoken("2kCSn0uFjMG24Kz87dUKXskSgBz_7JHf7aJv5wCVDBkPUAh6Q"); 
        const url = await ngrok.connect({
            addr: PORT
        });
        console.log(`ngrok tunnel established at ${url}`);
    } catch (error) {
        console.error('Error establishing ngrok tunnel:', error);
    }
});*/
