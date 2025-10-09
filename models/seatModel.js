const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  showtime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true,
  },
  row: String,
  seatNumber: Number,
  isAvailable: { type: Boolean, default: true },
});

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;
