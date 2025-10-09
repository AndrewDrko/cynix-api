const Ticket = require('../models/ticketModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// PENDING:
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

  const tickets = await Ticket.find({ buyer: userId })
    .populate({
      path: 'showtime',
      select: 'dateTime language subtitles',
      populate: [
        {
          path: 'movie',
          select: 'title synopsis genre posterUrl trailerUrl duration',
        },
        { path: 'screen', select: 'name' },
      ],
    })
    .populate({
      path: 'seatIds',
      select: 'row seatNumber',
    });

  if (!tickets) return next(new AppError('No tickets to show', 404));

  res.json({
    status: 'success',
    results: tickets.length,
    data: { tickets },
  });
});

exports.createTicket = catchAsync(async (req, res, next) => {
  const newTicket = await Ticket.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      ticket: newTicket,
    },
  });
});

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
