const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
// const APIFeatures = require('../utils/apiFeatures');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getSingleReview = factory.getOne(Review);
exports.addNewReview = factory.addNewOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
