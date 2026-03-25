const mongoose = require('mongoose');
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
  showtimeSnapshot: {
    movieTitle: {
      type: String,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    bannerUrl: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    screen: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    theater: {
      title: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
  },
  seatsSnapshot: [
    {
      row: {
        type: String,
        required: [true, 'A seat must have a row'],
      },
      seatNumber: {
        type: Number,
        required: [true, 'A seat must have a number'],
      },
    },
  ],
  showtime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: [true, 'A ticket must have a showtime'],
    select: false,
  },
  seatIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat',
      required: true,
      select: false,
    },
  ],
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A ticket must have a buyer'],
    select: false,
  },
});

// ticketSchema.pre('validate', async function (next) {
//   try {
//     const showtime = await Showtime.findById(this.showtime);

//     if (!showtime) return next(new AppError('Showtime not found', 404));
//     if (showtime.status === 'expired')
//       return next(new AppError('Showtime has expired', 400));

//     // VALIDATION
//     for (const seatId of this.seatIds) {
//       const seat = await Seat.findById(seatId);
//       if (!seat) return next(new AppError(`Seat ${seatId} not found`, 404));
//       if (!seat.isAvailable)
//         return next(new AppError(`Seat ${seatId} is not available`, 400));
//       if (seat.showtime.toString() !== this.showtime.toString())
//         return next(
//           new AppError(`Seat ${seatId} does not belong to this showtime`, 400),
//         );
//     }

//     this.pricePaid = showtime.price * this.seatIds.length;

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// ticketSchema.pre('save', async function (next) {
//   try {
//     const result = await Seat.updateMany(
//       { _id: { $in: this.seatIds }, isAvailable: true },
//       { $set: { isAvailable: false } },
//     );

//     if (result.modifiedCount !== this.seatIds.length) {
//       return next(new AppError('Some seats are already booked', 400));
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
