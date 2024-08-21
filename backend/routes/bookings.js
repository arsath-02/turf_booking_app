const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const Booking = require('../models/booking');
const User = require('../models/user');
const mongoose = require('mongoose');

// Create a new booking
router.post('/', authenticateJWT, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { turfId, bookingDate, startTime, endTime, totalAmount } = req.body;
        const userId = req.user.userid;

        if (!turfId || !bookingDate || !startTime || !endTime || !totalAmount) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        
        const existingBooking = await Booking.findOne({
            turfId,
            bookingDate,
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        });

        if (existingBooking) {
            return res.status(400).json({ success: false, message: 'Slot is already booked' });
        }

        const newBooking = new Booking({
            userId,
            turfId,
            bookingDate,
            startTime,
            endTime,
            totalAmount
        });

        const savedBooking = await newBooking.save({ session });

        
        await User.findByIdAndUpdate(userId, { $push: { bookings: savedBooking._id } }, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: savedBooking
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
});

// Get bookings for user
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.userid }).populate('turfId');
        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Error fetching bookings', error: err.message });
    }
});

// Update 
router.put('/:id', authenticateJWT, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const { bookingDate, startTime, endTime, totalAmount } = req.body;
        const userId = req.user.userid;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        booking.bookingDate = bookingDate || booking.bookingDate;
        booking.startTime = startTime || booking.startTime;
        booking.endTime = endTime || booking.endTime;
        booking.totalAmount = totalAmount || booking.totalAmount;

        const updatedBooking = await booking.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: 'Booking updated successfully',
            data: updatedBooking
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            success: false,
            message: 'Error updating booking',
            error: error.message
        });
    }
});

// Cancel 
router.delete('/:id', authenticateJWT, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const userId = req.user.userid;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        await Booking.deleteOne({ _id: id }, { session });

        // Update 
        await User.findByIdAndUpdate(userId, { $pull: { bookings: id } }, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error.message
        });
    }
});

module.exports = router;