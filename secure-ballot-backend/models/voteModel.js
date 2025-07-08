
const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  y0: { type: String, required: true, unique: true }, // Linking tag
  message: { type: Object, required: true },          // The vote content
  timestamp: { type: Date, default: Date.now },       // When it was cast
});

module.exports = mongoose.model("Vote", voteSchema);
