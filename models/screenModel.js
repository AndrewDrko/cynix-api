const mongoose = require('mongoose');
const Theater = require('./theaterModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const screenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A screen must have a name'],
    trim: true,
  },
  capacity: {
    type: Number,
    default: 0,
    // GENERATES AUTOMATIC
    // required: [true, 'A screen must have a capacity'],
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
        row: {
          type: String,
          enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        },
        seatsNumber: Number,
      },
    ],
    required: [true, 'A screen must have seats'],
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: [true, 'Screen must belong to a Theater'],
  },
});

screenSchema.pre('save', async function (next) {
  try {
    if (this.seats && this.seats.length > 0) {
      this.capacity = this.seats.reduce(
        (acc, seat) => acc + seat.seatsNumber,
        0,
      );

      const theater = await Theater.findById(this.theater);

      if (!theater)
        throw new AppError("The theater id provided doesn't exist", 404);
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Screen = mongoose.model('Screen', screenSchema);

module.exports = Screen;
