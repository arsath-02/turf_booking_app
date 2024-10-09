const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
    owner_name: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: String, required: true },
    image: { type: Buffer },
    category: { type: String, required: true },
    contactnumber: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    city: { type: String, required: true },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TurfOwner', required: true } // Corrected here
});

const Turf = mongoose.model('Turf', turfSchema);

module.exports = Turf;
