const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/booking');

const razorpay = new Razorpay({
    key_id: 'rzp_test_ciwYrvH4kZLaXq',
    key_secret: 'Nq3LJGRDZNE9UG7oRM8140mx'
});


router.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));


router.post('/webhook', async (req, res) => {
    const secret = razorpay.key_secret;

  
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(req.rawBody);
    const digest = shasum.digest('hex');

    if (digest === req.headers['Nicenisath9']) {
        const event = req.body.event;

        if (event === 'payment.captured') {
            const payment = req.body.payload.payment.entity;
            const receipt = payment.notes.receipt;

            
            await Booking.findByIdAndUpdate(receipt, { paymentStatus: 'completed' });

            res.status(200).json({ status: 'ok' });
        } else {
            res.status(400).json({ error: 'Unhandled event' });
        }
    } else {
        res.status(400).json({ error: 'Invalid signature' });
    }
});

module.exports = router;
