const express = require('express');
const router = express.Router();
const Turf = require('../models/turf');
const authenticateJWT = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

// Create new turf (Admin only)
router.post('/', authenticateJWT, upload.single('image'), async (req, res) => {
    const { role } = req.user;

    if (role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Only admins can register a turf.'
        });
    }

    const { name, location, price, rating, contactnumber, pricePerHour, city } = req.body;
    const image = req.file;

    if (!name || !location || !price || !contactnumber || !pricePerHour || !city || !image) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields.'
        });
    }

    const newTurf = new Turf({ name, location, price, rating, image: image.buffer, contactnumber, pricePerHour, city });

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

// Serve image by ID
router.get('/image/:id', async (req, res) => {
    try {
        const turf = await Turf.findById(req.params.id);
        if (!turf || !turf.image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.set('Content-Type', 'image/jpeg');
        res.send(turf.image);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching image', error: err });
    }
});

module.exports = router;
