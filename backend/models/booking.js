const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    turfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
    bookingDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['succeeded', 'pending', 'failed'], default: 'pending' },
    paymentIntentId: { type: String }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
