const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const User = require('../models/user');

// GET user details
router.get('/', authenticateJWT, async (req, res) => {
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

// PUT user details
router.put('/', authenticateJWT, async (req, res) => {
    try {
        const { firstname, lastname, email, phonenumber } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userid,
            { firstname, lastname, email, phonenumber },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Error updating user', error: err.message });
    }
});

// PUT change password
router.put('/change-password', authenticateJWT, async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'New passwords do not match' });
        }

        const user = await User.findById(req.user.userid);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Old password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Error changing password', error: err.message });
    }
});

module.exports = router;