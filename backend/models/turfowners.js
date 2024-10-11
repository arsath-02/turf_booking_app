const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const turfOwnerSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phonenumber: { type: String, required: true },
  role: { type: String, required: true, default: 'turfOwner' },
  city: { type: String, required: true }
});

turfOwnerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

turfOwnerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const TurfOwner = mongoose.model('TurfOwner', turfOwnerSchema);

module.exports = TurfOwner;
