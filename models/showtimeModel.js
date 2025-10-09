const mongoose = require('mongoose');
const Screen = require('./screenModel');
const Seat = require('./seatModel');
const AppError = require('../utils/appError');
const cron = require('node-cron');

const showtimeSchema = new mongoose.Schema({
  dateTime: {
    type: Date,
    required: [true, 'A showtime must have a dateTime'],
    unique: true,
  },
  expirationDate: {
    type: Date,
    validate: {
      validator: function (val) {
        return val >= this.dateTime;
      },
      message: 'Expiration date must be greater than date time',
    },
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
  screen: { type: mongoose.Schema.Types.ObjectId, ref: 'Screen' },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
});

// CRON FOR UPDATE SHOWTIME STATUS
cron.schedule('*/30 * * * *', async () => {
  const now = new Date();

  const result = await Showtime.updateMany(
    { expirationDate: { $lte: now }, status: 'active' },
    { $set: { status: 'expired' } },
  );

  console.log(
    `⏰ Showtime statuses updated automatically / CRON in ${now} / ${result.modifiedCount} documents updated`,
  );
});

// CRON FOR DELETE OBSOLETE SHOWTIMES
cron.schedule('0 0 * * *', async () => {
  // Se ejecuta todos los días a medianoche
  const now = new Date();

  // Buscar showtimes expirados hace más de 1 mes
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const expiredShowtimes = await Showtime.find({
    expirationDate: { $lte: oneMonthAgo },
  });

  for (const showtime of expiredShowtimes) {
    await Seat.deleteMany({ showtime: showtime._id });

    await showtime.deleteOne();
  }

  console.log(`${expiredShowtimes.length} expired showtimes removed at ${now}`);
});

showtimeSchema.pre('save', function (next) {
  if (!this.expirationDate && this.dateTime) {
    const expiration = new Date(this.dateTime);
    expiration.setHours(expiration.getHours() + 2);

    this.expirationDate = expiration;
  }

  if (this.expirationDate <= this.dateTime) {
    return next(new Error('Expiration date must be greater than date time'));
  }

  next();
});

showtimeSchema.pre('save', async function (next) {
  try {
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

const Showtime = mongoose.model('Showtime', showtimeSchema);

module.exports = Showtime;
