const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to the database
mongoose.connect('mongodb://localhost:27017/turfdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => {
        console.log('Database connection error:', err);
    });

// User schema
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phonenumber: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
});

const User = mongoose.model('User', userSchema);

// Turf schema
const turfSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: String, required: true },
    image: { type: String, required: true },
    contactnumber: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    city: { type: String, required: true },
});

const Turf = mongoose.model('Turf', turfSchema);

// Booking schema
const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    turfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
    bookingDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    totalAmount: { type: Number, required: true }
});

const Booking = mongoose.model('Booking', bookingSchema);

const adminEmail = "arsath02@gmail.com";

// Register new user
app.post('/register', async (req, res, next) => {
    const { firstname, lastname, email, password, phonenumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const role = email === adminEmail ? 'admin' : 'user';
    const newUser = new User({ firstname, lastname, email, password: hashedPassword, phonenumber, role });

    try {
        await newUser.save();
        const newToken = jwt.sign({ email: email, role: role }, "secretkey");
        res.status(200).json({
            success: true,
            data: {
                token: newToken,
                user: { firstname, lastname, email, phonenumber, role }
            }
        });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).send('Email already exists');
        } else {
            res.status(400).send('Error creating user');
        }
        next(err);
    }
});

// Authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    if (token) {
        jwt.verify(token, "secretkey", (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

// User login
app.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            res.status(400).send('User not found');
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            res.status(400).send('Password does not match');
            return;
        }

        const token = jwt.sign({
            userid: existingUser._id,
            email: existingUser.email,
            role: existingUser.role
        }, "secretkey");

        res.status(200).json({
            success: true,
            data: {
                token: token,
                user: {
                    firstname: existingUser.firstname,
                    lastname: existingUser.lastname,
                    email: existingUser.email,
                    phonenumber: existingUser.phonenumber,
                    role: existingUser.role
                }
            }
        });
    } catch (err) {
        res.status(400).send('Error logging in');
        next(err);
    }
});

// GET user profile
app.get('/profile', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.userid)
                               .populate({
                                   path: 'bookings',
                                   populate: {
                                       path: 'turfId',
                                       model: 'Turf'
                                   }
                               });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { firstname, lastname, email, phonenumber, role, bookings } = user;
        const userData = { firstname, lastname, email, phonenumber, role };
        const bookingData = role === 'admin' ? {} : { bookings };
        const data = { ...userData, ...bookingData };

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Error fetching user', error: err.message });
    }
});

// Create new turf
app.post('/turfs', authenticateJWT, async (req, res, next) => {
    const { name, location, price, rating, image, contactnumber, pricePerHour, city } = req.body;
    const newTurf = new Turf({ name, location, price, rating, image, contactnumber, pricePerHour, city });

    try {
        await newTurf.save();
        res.status(200).json({
            success: true,
            data: newTurf
        });
    } catch (err) {
        res.status(400).send('Error creating turf');
        next(err);
    }
});

// Get all turfs
app.get('/turfs', async (req, res, next) => {
    try {
        const turfs = await Turf.find();
        res.status(200).json({
            success: true,
            data: turfs
        });
    } catch (err) {
        res.status(400).send('Error fetching turfs');
        next(err);
    }
});

// Create new booking
app.post('/bookings', authenticateJWT, async (req, res, next) => {
    const { turfId, bookingDate, startTime, endTime, totalAmount } = req.body;
    const newBooking = new Booking({ userId: req.user.userid, turfId, bookingDate, startTime, endTime, totalAmount });

    try {
        // Save the new booking
        const savedBooking = await newBooking.save();

        // Add the booking reference to the user's bookings array
        await User.findByIdAndUpdate(req.user.userid, { $push: { bookings: savedBooking._id } });

        res.status(200).json({
            success: true,
            data: savedBooking
        });
    } catch (err) {
        res.status(400).send('Error creating booking');
        next(err);
    }
});

// Get user bookings
app.get('/bookings', authenticateJWT, async (req, res, next) => {
    try {
        const bookings = await Booking.find({ userId: req.user.userid }).populate('turfId');
        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (err) {
        res.status(400).send('Error fetching bookings');
        next(err);
    }
});
