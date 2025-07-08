
// models/VotingStatus.js
const mongoose = require('mongoose');

const VotingStatusSchema = new mongoose.Schema({
  isRegistrationOpen: { type: Boolean, default: false },
  isVotingOpen: { type: Boolean, default: false },
});

module.exports = mongoose.model('VotingStatus', VotingStatusSchema);

