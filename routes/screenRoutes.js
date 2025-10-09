const express = require('express');
const screenController = require('../controllers/screenController');

const router = express.Router();

router
  .route('/')
  .get(screenController.getAllScreen)
  .post(screenController.createScreen);

router
  .route('/:id')
  .get(screenController.getScreen)
  .patch(screenController.updateScreen)
  .delete(screenController.deleteScreen);

module.exports = router;
