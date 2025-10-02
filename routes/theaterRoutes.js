const express = require('express');
const theaterController = require('../controllers/theaterController');

const router = express.Router();

router
  .route('/')
  .get(theaterController.getAllTheaters)
  .post(theaterController.createTheater);

module.exports = router;
