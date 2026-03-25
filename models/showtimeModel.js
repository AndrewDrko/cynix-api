const mongoose = require('mongoose');
const Screen = require('./screenModel');
const Seat = require('./seatModel');
const AppError = require('../utils/appError');

const showtimeSchema = new mongoose.Schema({
  dateTime: {
    type: Date,
    required: [true, 'A showtime must have a dateTime'],
  },
  // GENERATES AUTHOMATIC
  endTime: {
    type: Date,
    // required: true,
  },
  price: {
    type: Number,
    required: [true, 'A showtime must have a price'],
  },
  language: {
    type: String,
    default: 'Español',
    required: [true, 'A showtime must have a language'],
  },
  subtitles: { type: Boolean, default: false },
  status: {
    type: String,
    required: [true, 'A showtime must have a status'],
    enum: ['active', 'expired'],
    default: 'active',
  },
  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen',
    required: [true, 'A showtime must belong to a screen'],
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'A showtime must belong to a movie'],
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: [true, 'A showtime must belong to a theater'],
  },
});

// showtimeSchema.index({ movie: 1, screen: 1, dateTime: 1 }, { unique: true });

showtimeSchema.pre('save', async function (next) {
  if (!this.isModified('dateTime') && !this.isModified('movie')) return next();

  const movie = await mongoose.model('Movie').findById(this.movie);
  if (!movie) return next(new Error('Movie not found'));

  this.endTime = new Date(this.dateTime.getTime() + movie.duration * 60000);

  next();
});

// VALIDAR TRASLAPES
showtimeSchema.pre('save', async function (next) {
  const conflicting = await mongoose.model('Showtime').findOne({
    screen: this.screen,
    _id: { $ne: this._id }, // evitar conflicto consigo mismo
    dateTime: { $lt: this.endTime }, // empieza antes de que esta termine
    endTime: { $gt: this.dateTime }, // termina después de que esta empieza
  });

  if (conflicting) {
    return next(
      new AppError(
        'This showtime overlaps with another existing showtime',
        400,
      ),
    );
  }

  next();
});

showtimeSchema.pre('save', async function (next) {
  try {
    if (!this.isNew) return next();

    const screen = await Screen.findById(this.screen);

    if (!screen) {
      throw new AppError("The screen id provided doesn't exist", 404);
    }

    const seatsToCreate = [];

    screen.seats.forEach((seatRow) => {
      for (let i = 1; i <= seatRow.seatsNumber; i++) {
        seatsToCreate.push({
          showtime: this._id,
          row: seatRow.row,
          seatNumber: i,
          isAvailable: true,
        });
      }
    });

    await Seat.insertMany(seatsToCreate);

    next();
  } catch (error) {
    next(error);
  }
});

showtimeSchema.pre('findOneAndDelete', async function (next) {
  const showtime = await this.model.findOne(this.getFilter());
  if (!showtime) return next();

  await Seat.deleteMany({ showtime: showtime._id });
  next();
});

const Showtime = mongoose.model('Showtime', showtimeSchema);

module.exports = Showtime;
