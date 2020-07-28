const express = require('express');

const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

// middleware to check valid id
// router.param('id', tourController.checkID);

//query.sort().select().skip().limit()
// the best tours for the chepest price and ratingAverage
// ?limit=5&sort=-ratingAverage,price

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// tour route need defend by middleware indentificate
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getOneTour)
  .patch(tourController.patchTour)
  .delete(tourController.deleteTour);

module.exports = router;
