const Seat = require('../models/seatModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Obtener todos los seats
exports.getAllSeats = catchAsync(async (req, res, next) => {
  const allSeats = await Seat.find();

  if (!allSeats || allSeats.length === 0) {
    return next(new AppError('No seats were found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      seats: allSeats,
    },
  });
});

// Obtener un seat por ID
exports.getSeat = catchAsync(async (req, res, next) => {
  const seat = await Seat.findById(req.params.id).populate({
    path: 'showtime',
    select: 'dateTime language subtitles screen movie',
  });

  if (!seat) {
    return next(new AppError('No seat found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      seat,
    },
  });
});

// Crear un seat
exports.createSeat = catchAsync(async (req, res, next) => {
  const newSeat = await Seat.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      seat: newSeat,
    },
  });
});

// Eliminar un seat
exports.deleteSeat = catchAsync(async (req, res, next) => {
  const seat = await Seat.findByIdAndDelete(req.params.id);

  if (!seat) throw new AppError('No seat found with that ID', 404);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Actualizar un seat
exports.updateSeat = catchAsync(async (req, res, next) => {
  const seat = await Seat.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!seat) throw new AppError('No seat found with that ID', 404);

  res.status(200).json({
    status: 'success',
    data: {
      seat,
    },
  });
});
