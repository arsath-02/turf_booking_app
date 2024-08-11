const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminEmail = "arsath02@gmail.com";


// Register new user
router.post('/register', async (req, res) => {
    const { firstname, lastname, email, password, phonenumber } = req.body;

    if (!firstname || !lastname || !email || !password || !phonenumber) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const role = email === adminEmail ? 'admin' : 'user';
        const newUser = new User({ firstname, lastname, email, password: hashedPassword, phonenumber, role });

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
            
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(400).json({ message: 'Error creating user', error: err.message });
        }
    }
});


// Login user
router.post('/login', async (req, res) => {
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
    }
});




module.exports = router;
