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

    const newTurf = new Turf({ 
        name, 
        location, 
        price, 
        rating, 
        image: image.buffer, 
        category,
        contactnumber, 
        pricePerHour, 
        city 
    });

    try {
        await newTurf.save();
        res.status(201).json({
            success: true,
            data: newTurf
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error creating turf' });
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
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching turfs' });
    }
});

// Serve image by ID
router.get('/image/:id', async (req, res) => {
    try {
        const turf = await Turf.findById(req.params.id);
        if (!turf || !turf.image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        res.set('Content-Type', 'image/jpeg');
        res.send(turf.image);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching image' });
    }
});

// Get turfs by location
router.get('/search', async (req, res) => {
    const location = req.query.location;

    try {
        const turfs = await Turf.find({ location });
        res.status(200).json({
            success: true,
            data: turfs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching turfs',
        });
    }
});

// Get turf details by ID
router.get('/:id', async (req, res) => {
    try {
        const turfId = req.params.id; // Get ID from the URL parameter
        const turf = await Turf.findById(turfId); // Fetch turf by ID

        if (!turf) {
            return res.status(404).json({ success: false, message: 'Turf not found' });
        }

        res.status(200).json({ success: true, data: turf }); // Return turf data
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ success: false, message: 'Error fetching turf details' });
    }
});


module.exports = router;