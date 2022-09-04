const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      "Your booking was successful! Please check your email for confirmation. If your new booking doesn't show up immediately, please come back later.";
  }
  next();
};

exports.getHomePage = (req, res) => {
  res.status(200).render('homepage', {
    title: 'Homepage',
  });
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Trips',
    tours,
  });
});

exports.getSingleTrip = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  const isBooked = await Booking.find({
    user: req.user.id,
    tour: tour.id,
  });
  const tourDate = isBooked.date;

  if (!tour) {
    return next(
      new AppError(
        'There is no trip with that name! Please check your spelling.',
        404
      )
    );
  }

  // 2) Build template
  // 3) Render that template using data from 1)
  res.status(200).render('trip', {
    title: tour.name,
    isBooked,
    tourDate,
    tour,
  });
});

exports.login = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('login', {
      title: 'Log into your account',
    });
};

exports.signup = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up for SkyTrip',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTrips = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Trips',
    tours,
  });
});
