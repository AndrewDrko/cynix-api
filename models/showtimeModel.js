const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  dateTime: {
    type: Date,
    required: [true, 'A showtime must have a dateTime'],
  },
  price: {
    type: Number,
    required: [true, 'A showtime must have a price'],
  },
  screen: { type: mongoose.Schema.Types.ObjectId, ref: 'Screen' },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
});

const Showtime = mongoose.model('Showtime', showtimeSchema);

module.exports = Showtime;
