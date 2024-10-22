const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TurfOwner = require('../models/turfowners'); 
const adminEmail = "arsath02@gmail.com";

// Import necessary modules
// Admin email for role assignment

// Register new user or turf owner
router.post('/register', async (req, res) => {
    const { firstname, lastname, email, password, phonenumber, userType, city } = req.body;
    console.log(req.body);

    // Check if required fields are present
    if (!firstname || !lastname || !email || !password || !phonenumber || !userType || (userType === 'turfOwner' && !city)) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = email === adminEmail ? 'admin' : 'user';
        const newUser = { firstname, lastname, email, password: hashedPassword, phonenumber, role, city };

        // Save the user as either a normal user or a turf owner
        if (userType === 'turfOwner') {
            const newTurfOwner = new TurfOwner(newUser);
            await newTurfOwner.save();
        } else {
            const newUserInstance = new User(newUser);
            await newUserInstance.save();
        }

        // Generate JWT token
        const token = jwt.sign({ email: email, role: role }, "secretkey");

        // Send a single response with both success message and token
        return res.status(200).json({
            message: 'Registration successful',
            success: true,
            data: {
                token: token,
                user: { firstname, lastname, email, phonenumber, role, city }
            }
        });

    } catch (err) {
        // Handle duplicate email error
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        } else {
            // Handle server error
            console.log('Error inserting user:', err);  // Log the error for debugging
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
});





router.post('/login', async (req, res) => {
    const { email, password, userType } = req.body; 
    let existingUser;

    try {
        console.log(`Attempting to login user: ${email}, userType: ${userType}`);

        // Check if the user type is turf owner or regular user
        if (userType === 'turfOwner') {
            existingUser = await TurfOwner.findOne({ email });
        } else if (userType === 'user') {
            existingUser = await User.findOne({ email });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid user type' });
        }

        // Check if user exists
        if (!existingUser) {
            console.log('User not found');
            return res.status(400).json({ success: false, message: 'User does not exist' });
        }

        // Log the stored hashed password
        console.log('Stored hashed password:', existingUser.password);
        console.log('Trying to login with password:', password); // Log the password being tried

        // Test with hardcoded password for comparison
        // Uncomment the following line to test with a hardcoded value
        // const isPasswordCorrect = await bcrypt.compare('securepassword', existingUser.password);
        
        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            console.log('Invalid password');
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: existingUser.email, role: existingUser.role },
            process.env.JWT_SECRET || 'yourFallbackSecretKey'
        );
        
        
        // Return successful response
        res.status(200).json({
            success: true,
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
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});


module.exports = router;
