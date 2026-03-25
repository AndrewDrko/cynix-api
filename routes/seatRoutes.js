const express = require('express');
const seatController = require('../controllers/seatController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/:showtimeId/seats')
  .get(authController.protect, seatController.getSeatsByShowtime);

router
  .route('/')
  .get(authController.protect, seatController.getAllSeats)
  .post(seatController.createSeat);

router
  .route('/:id')
  .get(seatController.getSeat)
  .patch(seatController.updateSeat)
  .delete(seatController.deleteSeat);

module.exports = router;
