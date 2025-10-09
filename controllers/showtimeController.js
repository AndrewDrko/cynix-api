const Showtime = require('../models/showtimeModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllShowtimes = catchAsync(async (req, res, next) => {
  const allShowtimes = await Showtime.find();

  if (!allShowtimes) {
    return next(new AppError('No showtimes were found'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      showtimes: allShowtimes,
    },
  });
});

exports.getShowtime = catchAsync(async (req, res, next) => {
  const showtime = await Showtime.findById(req.params.id);

  if (!showtime) {
    return next(new AppError('No showtime found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      showtime: showtime,
    },
  });
});

exports.createShowtime = catchAsync(async (req, res, next) => {
  const newShowtime = await Showtime.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      showtime: newShowtime,
    },
  });
});

exports.deleteShowtime = catchAsync(async (req, res, next) => {
  const showtime = await Showtime.findByIdAndDelete(req.params.id);

  if (!showtime) throw new AppError('No showtime found with that ID', 404);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateShowtime = catchAsync(async (req, res, next) => {
  const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!showtime) throw new AppError(('No showtime found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      showtime,
    },
  });
});
