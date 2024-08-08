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




module.exports = router;
