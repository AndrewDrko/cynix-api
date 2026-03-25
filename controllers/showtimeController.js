const Showtime = require('../models/showtimeModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Screen = require('../models/screenModel');
const Movie = require('../models/movieModel');

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
  const showtime = await Showtime.findById(req.params.id)
    .populate({
      path: 'movie',
    })
    .populate({
      path: 'screen',
      select: 'name capacity type',
    });

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

exports.getShowtimesByMovie = catchAsync(async (req, res, next) => {
  const { movie, theater } = req.query;

  // Validaciones básicas
  if (!movie) {
    return next(new AppError('You must provide a movie ID', 400));
  }

  const now = new Date();

  const filter = {
    movie,
    status: 'active',
    dateTime: { $gte: now },
    endTime: { $gte: now },
  };

  if (theater) filter.theater = theater;

  const showtimes = await Showtime.find(filter)
    .populate('screen', '_id name type') // opcional
    .populate('theater')
    .sort({ startTime: 1 }); // ordenarlos por hora

  const selectedMovie = await Movie.findById(movie);

  res.status(200).json({
    status: 'success',
    results: showtimes.length,
    data: { selectedMovie, showtimes },
  });
});

// exports.screenValidator = catchAsync(async (req, res, next) => {
//   const movie = await Movie.findById(req.body.movie);
//   if (!movie) return next(new AppError('Movie not found', 404));

//   const startTime = new Date(req.body.dateTime);
//   const endTime = new Date(startTime.getTime() + movie.duration * 60000);
//   req.body.endTime = endTime;

//   // Buscar traslape
//   const conflicting = await Showtime.findOne({
//     screen: req.body.screen,
//     dateTime: { $lte: endTime },
//     // endTime: { $gte: startTime },
//   });

//   if (conflicting) {
//     return next(
//       new AppError(`This screen already has a showtime at that hour.`, 400),
//     );
//   }

//   next();
// });

exports.createShowtime = catchAsync(async (req, res, next) => {
  const movie = await Movie.findById(req.body.movie);
  if (!movie) return next(new AppError('Movie not found', 404));

  const startTime = new Date(req.body.dateTime);
  const endTime = new Date(startTime.getTime() + movie.duration * 60000);
  req.body.endTime = endTime;

  // Buscar traslape
  const conflicting = await Showtime.findOne({
    screen: req.body.screen,
    dateTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  if (conflicting) {
    return next(
      new AppError(`This screen already has a showtime at that hour.`, 400),
    );
  }

  const newShowtime = await Showtime.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      showtime: newShowtime,
    },
  });
});

exports.deleteShowtime = catchAsync(async (req, res, next) => {
  const showtime = await Showtime.findById(req.params.id);

  if (!showtime) {
    return next(new AppError('No showtime found with that ID', 404));
  }

  const screenId = showtime.screen;

  await Showtime.findByIdAndDelete(req.params.id);

  if (screenId) {
    await Screen.findByIdAndUpdate(screenId, { isAvailable: true });
  }

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
