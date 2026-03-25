const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.route('/top-5-movies').get(movieController.getTopMovies);

router
  .route('/')
  .get(movieController.getAllMovies)
  .post(movieController.createMovie);

router
  .route('/:id')
  .get(movieController.getMovie)
  .patch(movieController.updateMovie)
  .delete(movieController.deleteMovie);

module.exports = router;
