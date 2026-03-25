const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A movie must have a title'],
      trim: true,
      unique: true,
    },
    genre: {
      type: String,
      required: [true, 'A movie must have a genre'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A movie must have a duration'],
    },
    year: {
      type: Number,
      required: [true, 'A movie must have a year'],
    },
    directors: [String],
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      required: [true, 'A movie must have ratingsAverage'],
      default: 0,
    },
    classification: {
      type: String,
      required: [true, 'A movie must have a classification'],
    },
    actors: [String],
    synopsis: {
      type: String,
      trim: true,
    },
    bannerUrl: {
      type: String,
    },
    posterUrl: {
      type: String,
    },
    trailerUrl: {
      type: String,
    },
  },
  { timestamps: true },
);

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
