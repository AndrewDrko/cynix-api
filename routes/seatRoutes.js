const express = require('express');
const seatController = require('../controllers/seatController');

const router = express.Router();

router
  .route('/')
  .get(seatController.getAllSeats)
  .post(seatController.createSeat);

router
  .route('/:id')
  .get(seatController.getSeat)
  .patch(seatController.updateSeat)
  .delete(seatController.deleteSeat);

module.exports = router;
