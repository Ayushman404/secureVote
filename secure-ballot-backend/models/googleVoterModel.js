
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  picture: { type: String },
  publicKey: { type: String, default: null }, // For future use
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);