const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

// TICKETS
router.get(
  '/my-tickets',
  authController.protect,
  ticketController.getMyTickets,
);

router.get(
  '/my-ticket/:id',
  authController.protect,
  ticketController.getMyTicket,
);

router.get('/me', authController.protect, authController.getMe);

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').post(authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
// ROUTE FOR RESETING PASSWORD (from EMAIL RECEIVED BY THE USER)
router.patch('/resetPassword/:token', authController.resetPassword);

router.route('/').get(userController.getAllUsers);

// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
