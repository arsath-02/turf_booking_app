const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const mongoose = require('mongoose');
const crypto = require('crypto');
const Booking = require('../models/booking');
const User = require('../models/user');
const authenticateJWT = require('../middleware/authMiddleware');

const razorpay = new Razorpay({
    key_id: 'rzp_test_ciwYrvH4kZLaXq',
    key_secret: 'Nq3LJGRDZNE9UG7oRM8140mx'
});

router.post('/', authenticateJWT, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { bookingId, amount } = req.body;
        const userId = req.user.userid;

        const booking = await Booking.findById(bookingId).session(session);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: 'INR',
            receipt: bookingId.toString(),
            payment_capture: 1
        });

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            success: false,
            message: 'Error creating payment',
            error: error.message
        });
    }
});

// Webhook endpoint to handle payment success
router.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const secret = 'Nq3LJGRDZNE9UG7oRM8140mx';

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
        const { payload } = req.body;
        const { payment_id, order_id } = payload.payment.entity;

        try {
            const bookingId = order_id; // Assuming order_id is the bookingId
            const booking = await Booking.findById(bookingId);

            if (booking) {
                booking.paymentStatus = 'Paid';
                booking.paymentId = payment_id;
                await booking.save();

                res.status(200).json({ success: true, message: 'Payment verified and booking updated' });
            } else {
                res.status(404).json({ success: false, message: 'Booking not found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error updating booking', error: error.message });
        }
    } else {
        res.status(400).json({ success: false, message: 'Invalid signature' });
    }
});

module.exports = router;