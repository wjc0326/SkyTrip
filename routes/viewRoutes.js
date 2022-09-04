const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(viewController.alerts);
router.use(authController.isLoggedIn);

router.get('/', authController.isLoggedIn, viewController.getHomePage);
router.get('/overview', authController.isLoggedIn, viewController.getOverview);
router.get(
  '/trip/:slug',
  authController.isLoggedIn,
  authController.protect,
  viewController.getSingleTrip
);
router.get('/login', authController.isLoggedIn, viewController.login);
router.get('/signup', authController.isLoggedIn, viewController.signup);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-trips', authController.protect, viewController.getMyTrips);

module.exports = router;
