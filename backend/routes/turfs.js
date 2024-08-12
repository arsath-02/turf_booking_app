const express = require('express');
const router = express.Router();
const Turf = require('../models/turf');
const authenticateJWT = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

// Create new turf (Admin only)
router.post('/', authenticateJWT, async (req, res) => {
    const { role } = req.user;

    if (role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Only admins can register a turf.'
        });
    }

    const { name, location, price, rating, image, contactnumber, pricePerHour, city } = req.body;

    // Simple server-side validation
    if (!name || !location || !price || !contactnumber || !pricePerHour || !city || !image) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields.'
        });
    }

    const newTurf = new Turf({ name, location, price, rating, image, contactnumber, pricePerHour, city });

    try {
        await newTurf.save();
        res.status(200).json({
            success: true,
            data: newTurf
        });
    } catch (err) {
        res.status(400).send('Error creating turf');
    }
});


// Get all turfs
router.get('/', async (req, res) => {
    try {
        const turfs = await Turf.find();
        res.status(200).json({
            success: true,
            data: turfs
        });
    } catch (err) {
        res.status(400).send('Error fetching turfs');
    }
});

module.exports = router;
