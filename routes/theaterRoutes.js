const express = require('express');
const theaterController = require('../controllers/theaterController');

const router = express.Router();

router
  .route('/')
  .get(theaterController.getAllTheaters)
  .post(theaterController.createTheater);

router
  .route('/:id')
  .get(theaterController.getTheater)
  .patch(theaterController.updateTheater)
  .delete(theaterController.deleteTheater);

module.exports = router;
