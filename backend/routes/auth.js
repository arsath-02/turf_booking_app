const express = require('express');
const User = require('../models/user');
const TurfOwner = require('../models/turfowners');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// Login route
router.post('/auth/login', [
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('password').not().isEmpty().withMessage('Password is required'),
  check('userType').isIn(['user', 'turfOwner']).withMessage('Invalid user type')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password, userType } = req.body;

  try {
    let user;
    if (userType === 'user') {
      user = await User.findOne({ email });
    } else if (userType === 'turfOwner') {
      user = await TurfOwner.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Register route
router.post('/register', [
  check('firstname').not().isEmpty().withMessage('Firstname is required'),
  check('lastname').not().isEmpty().withMessage('Lastname is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('phonenumber').not().isEmpty().withMessage('Phonenumber is required'),
  check('userType').isIn(['user', 'turfOwner']).withMessage('User type must be either user or turfOwner'),
  check('city').optional().not().isEmpty().withMessage('City is required for turf owners')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { firstname, lastname, email, password, phonenumber, userType, city } = req.body;

  try {
    let existingUser;
    if (userType === 'user') {
      existingUser = await User.findOne({ email });
    } else if (userType === 'turfOwner') {
      existingUser = await TurfOwner.findOne({ email });
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user';
    const newUser = userType === 'user'
      ? new User({ firstname, lastname, email, password: hashedPassword, phonenumber, role })
      : new TurfOwner({ firstname, lastname, email, password: hashedPassword, phonenumber, role, city });

    await newUser.save();
    const token = jwt.sign({ email: email, role: role }, process.env.JWT_SECRET);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: { firstname, lastname, email, phonenumber, role }
      }
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
