const express = require('express');
const router = express.Router();
const User = require('../models/user');
const TurfOwner = require('../models/turfowners');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin email for role assignment
const adminEmail = "arsath02@gmail.com";

// Register Route
router.post('/register', async (req, res) => {
    const { firstname, lastname, email, password, phonenumber, userType, city } = req.body;
    
    // Ensure all required fields are present
    if (!firstname || !lastname || !email || !password || !phonenumber || !userType || (userType === 'turfOwner' && !city)) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email }) || await TurfOwner.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password before storing it
        
        const role = email === adminEmail ? 'admin' : 'user';
        const newUser = { firstname, lastname, email, password: password, phonenumber, role, city };

        // Store the user either in the TurfOwner or User collection
        if (userType === 'turfOwner') {
            const newTurfOwner = new TurfOwner(newUser);
            await newTurfOwner.save();
        } else {
            const newUserInstance = new User(newUser);
            await newUserInstance.save();
        }

        // Generate a JWT token
        const token = jwt.sign({ email, role }, process.env.JWT_SECRET || "yourFallbackSecretKey", { expiresIn: '1h' });

        // Respond with a success message and the token
        return res.status(200).json({
            message: 'Registration successful',
            success: true,
            data: {
                token: token,
                user: { firstname, lastname, email, phonenumber, role, city }
            }
        });
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password, userType } = req.body;

    try {
        let existingUser;

        // Query the correct collection based on userType
        if (userType === 'turfOwner') {
            existingUser = await TurfOwner.findOne({ email });
        } else if (userType === 'user') {
            existingUser = await User.findOne({ email });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid user type' });
        }

        // Check if the user exists
        if (!existingUser) {
            return res.status(400).json({ success: false, message: 'User does not exist' });
        }

        // Compare the entered password with the hashed password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: 'Incorrect password' });
        }

        // Generate a JWT token for the logged-in user
        const token = jwt.sign(
            { email: existingUser.email, role: existingUser.role },
            process.env.JWT_SECRET || 'yourFallbackSecretKey',
            { expiresIn: '1h' }
        );

        // Return success response with token and user data
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token: token,
                user: {
                    email: existingUser.email,
                    role: existingUser.role
                }
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;
