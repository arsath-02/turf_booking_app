const express = require('express');
const router = express.Router();
const Turf = require('../models/turf');
const authenticateJWT = require('../middleware/authMiddleware');

// Create new turf
router.post('/', authenticateJWT, async (req, res) => {
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
