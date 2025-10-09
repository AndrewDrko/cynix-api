const Movie = require('../models/movieModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const allMovies = await Movie.find();

  if (!allMovies) {
    return next(new AppError('No movies were found'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      movies: allMovies,
    },
  });
});

exports.getMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return next(new AppError('No movie found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      movie: movie,
    },
  });
});

exports.createMovie = catchAsync(async (req, res, next) => {
  const newMovie = await Movie.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      movie: newMovie,
    },
  });
});

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) throw new AppError('No movie found with that ID', 404);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
  const movie = await Theater.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!movie) throw new AppError(('No movie found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});
