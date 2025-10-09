const express = require('express');
const showtimeController = require('../controllers/showtimeController');

const router = express.Router();

router
  .route('/')
  .get(showtimeController.getAllShowtimes)
  .post(showtimeController.createShowtime);

router
  .route('/:id')
  .get(showtimeController.getShowtime)
  .patch(showtimeController.updateShowtime)
  .delete(showtimeController.deleteShowtime);

module.exports = router;
