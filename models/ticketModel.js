const mongoose = require('mongoose');
const Showtime = require('./showtimeModel');
const Seat = require('./seatModel');
const AppError = require('../utils/appError');
const { nanoid } = require('nanoid');

const ticketSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: [true, 'A ticket must have an order number'],
    unique: true,
    trim: true,
    default: () => `ORD-${nanoid(8)}`,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  pricePaid: {
    type: Number,
    required: [true, 'A ticket must have a price'],
  },
  status: {
    type: String,
    enum: ['reserved', 'paid', 'cancelled'],
    default: 'reserved',
  },
  showtime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: [true, 'A ticket must belong to a showtime'],
  },
  seatIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat',
      required: [true, 'A seat must be selected'],
    },
  ],
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A ticket must have a buyer'],
  },
});

ticketSchema.pre('validate', async function (next) {
  try {
    const showtime = await Showtime.findById(this.showtime);

    if (!showtime) return next(new AppError('Showtime not found', 404));
    if (showtime.status === 'expired')
      return next(new AppError('Showtime has expired', 400));

    // VALIDATION
    for (const seatId of this.seatIds) {
      const seat = await Seat.findById(seatId);
      if (!seat) return next(new AppError(`Seat ${seatId} not found`, 404));
      if (!seat.isAvailable)
        return next(new AppError(`Seat ${seatId} is not available`, 400));
      if (seat.showtime.toString() !== this.showtime.toString())
        return next(
          new AppError(`Seat ${seatId} does not belong to this showtime`, 400),
        );
    }

    this.pricePaid = showtime.price * this.seatIds.length;

    next();
  } catch (err) {
    next(err);
  }
});

ticketSchema.pre('save', async function (next) {
  try {
    const result = await Seat.updateMany(
      { _id: { $in: this.seatIds }, isAvailable: true },
      { $set: { isAvailable: false } },
    );

    if (result.modifiedCount !== this.seatIds.length) {
      return next(new AppError('Some seats are already booked', 400));
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
