const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A screen must have a name'],
    unique: true,
    trim: true,
  },
  capacity: {
    type: Number,
    required: [true, 'A screen must have a capacity'],
  },
  type: {
    type: String,
    required: [true, 'A screen must have a type'],
    enum: ['Standard', 'VIP', '3D', '4D'],
    default: 'Standard',
  },
  seats: {
    type: [
      {
        row: String,
        number: Number,
      },
    ],
    required: [true, 'A screen must have seats'],
  },
  theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater' },
});

const Screen = mongoose.model('Screen', screenSchema);

module.exports = Screen;
