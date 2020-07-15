const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController');

//middleware to check valid id
router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getOneTour)
  .patch(tourController.patchTour)
  .delete(tourController.deleteTour);

module.exports = router;
