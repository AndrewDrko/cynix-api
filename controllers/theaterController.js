const Theater = require('../models/theaterModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllTheaters = catchAsync(async (req, res, next) => {
  const allTheaters = await Theater.find();

  if (!allTheaters) {
    return next(new AppError('No theaters were found'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      theaters: allTheaters,
    },
  });
});

exports.getTheater = catchAsync(async (req, res, next) => {
  const theater = await Theater.findById(req.params.id);

  if (!theater) {
    return next(new AppError('No theater found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      theater: theater,
    },
  });
});

exports.createTheater = catchAsync(async (req, res, next) => {
  const newTheater = await Theater.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      theater: newTheater,
    },
  });
});

exports.deleteTheater = catchAsync(async (req, res, next) => {
  const theater = await Theater.findByIdAndDelete(req.params.id);

  if (!theater) throw new AppError('No theater found with that ID', 404);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateTheater = catchAsync(async (req, res, next) => {
  const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!theater) throw new AppError(('No theater found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      theater,
    },
  });
});
