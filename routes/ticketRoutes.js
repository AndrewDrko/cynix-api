const express = require('express');
const ticketController = require('../controllers/ticketController');
const authController = require('../controllers/authController');

const router = express.Router();

// FOR ADMINS ONLY
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo(['admin']),
    ticketController.getAllTickets,
  )
  .post(authController.protect, ticketController.createTicket);

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo(['admin']),
    ticketController.getTicket,
  )
  .patch(
    authController.protect,
    authController.restrictTo(['admin']),
    ticketController.updateTicket,
  )
  .delete(
    authController.protect,
    authController.restrictTo(['admin']),
    ticketController.deleteTicket,
  );

module.exports = router;
