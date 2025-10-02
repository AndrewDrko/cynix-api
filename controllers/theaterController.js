const Theater = require('../models/theaterModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllTheaters = catchAsync(async (req, res, next) => {
  const allTheaters = await Theater.find();
  console.log(allTheaters);

  res.status(200).json({
    status: 'success',
    data: {
      theaters: allTheaters,
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
