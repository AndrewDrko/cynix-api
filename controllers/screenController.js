const Screen = require('../models/screenModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllScreen = catchAsync(async (req, res, next) => {
  const allScreens = await Screen.find();

  if (!allScreens) {
    return next(new AppError('No screens to show'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      screens: allScreens,
    },
  });
});

exports.getScreen = catchAsync(async (req, res, next) => {
  const screen = await Screen.findById(req.params.id).populate('theater');

  if (!screen) {
    return next(new AppError('No screen found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      screen: screen,
    },
  });
});

exports.createScreen = catchAsync(async (req, res, next) => {
  const newScreen = await Screen.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      screen: newScreen,
    },
  });
});

exports.deleteScreen = catchAsync(async (req, res, next) => {
  const screen = await Screen.findByIdAndDelete(req.params.id);

  if (!screen) throw new AppError('No screen found with that ID', 404);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateScreen = catchAsync(async (req, res, next) => {
  const screen = await Theater.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!screen) throw new AppError(('No screen found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      screen,
    },
  });
});
