const Movie = require('../models/movieModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Movie.find().select(
      '_id title duration classification genre posterUrl bannerUrl rating',
    ),
    {
      ...req.query,
    },
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const allMovies = await features.query;

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
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
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

exports.getTopMovies = catchAsync(async (req, res, next) => {
  const topMovies = await Movie.aggregate([
    {
      $sort: { rating: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 1,
        title: 1,
        synopsis: 1,
        posterUrl: 1,
        bannerUrl: 1,
        trailerUrl: 1,
      },
    },
  ]);

  if (!topMovies || topMovies.length === 0) {
    return next(new AppError('No movies found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: topMovies.length,
    data: topMovies,
  });
});
