const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photoURL: String,
  dob: Date,
  careerInfo: String,
  matchesPlayed: Number,
  runsScored: Number,
  wicketsTaken: Number
});

module.exports = mongoose.model('Player', playerSchema);