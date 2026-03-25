const Seat = require('../models/seatModel');
const Showtime = require('../models/showtimeModel');
const Ticket = require('../models/ticketModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllTickets = catchAsync(async (req, res, next) => {
  const allTickets = await Ticket.find();

  if (!allTickets) {
    return next(new AppError('No tickets were found'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tickets: allTickets,
    },
  });
});

exports.getTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(new AppError('No ticket found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      ticket: ticket,
    },
  });
});

exports.getMyTickets = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();

  const tickets = await Ticket.find({ buyer: userId });

  if (!tickets) return next(new AppError('No tickets to show', 404));

  res.json({
    status: 'success',
    results: tickets.length,
    data: { tickets },
  });
});

exports.getMyTicket = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();

  const ticket = await Ticket.findOne({ buyer: userId, _id: req.params.id });

  if (!ticket) return next(new AppError('No ticket to show', 404));

  res.json({
    status: 'success',
    ticket,
  });
});

exports.createTicket = async (req, res, next) => {
  try {
    const { showtime, seatIds } = req.body;

    if (!showtime) {
      return next(new AppError('Showtime is required', 400));
    }

    if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return next(new AppError('At least one seat is required', 400));
    }

    // 1️⃣ Obtener showtime con todo lo necesario
    const showtimeDoc = await Showtime.findById(showtime)
      .populate('movie', 'title posterUrl bannerUrl')
      .populate('theater', 'name address')
      .populate('screen', '_id name');

    if (!showtimeDoc) return next(new AppError('Showtime not found', 404));

    console.log(showtimeDoc.movie);

    if (showtimeDoc.status === 'expired')
      return next(new AppError('Showtime has expired', 400));

    // 2️⃣ Obtener asientos
    const seats = await Seat.find({
      _id: { $in: seatIds },
      showtime,
    });

    if (seats.length !== seatIds.length) {
      return next(new AppError('Some seats are invalid', 400));
    }

    const unavailable = seats.find((s) => !s.isAvailable);
    if (unavailable) {
      return next(
        new AppError(`Seat ${unavailable._id} is not available`, 400),
      );
    }

    // 3️⃣ Snapshots
    const showtimeSnapshot = {
      movieTitle: showtimeDoc.movie.title,
      posterUrl: showtimeDoc.movie.posterUrl,
      bannerUrl: showtimeDoc.movie.bannerUrl,
      dateTime: showtimeDoc.dateTime,
      screen: {
        id: showtimeDoc.screen._id,
        name: showtimeDoc.screen.name,
      },
      theater: {
        title: showtimeDoc.theater.name,
        address: showtimeDoc.theater.address,
      },
    };

    const seatsSnapshot = seats.map((seat) => ({
      row: seat.row,
      seatNumber: seat.seatNumber,
    }));

    // 4️⃣ Crear ticket
    const ticket = await Ticket.create({
      showtime,
      seatIds,
      buyer: req.user.id,
      pricePaid: showtimeDoc.price * seats.length,
      showtimeSnapshot,
      seatsSnapshot,
      status: 'reserved',
    });

    // 5️⃣ Bloquear asientos
    await Seat.updateMany(
      { _id: { $in: seatIds } },
      { $set: { isAvailable: false } },
    );

    res.status(201).json({
      status: 'success',
      data: {
        ticket,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findByIdAndDelete(req.params.id);

  if (!ticket) throw new AppError('No ticket found with that ID', 404);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!ticket) throw new AppError(('No ticket found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      ticket,
    },
  });
});
