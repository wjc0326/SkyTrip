/* eslint-disable arrow-body-style */
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const sendEmail = require('../utils/sendEmail');

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
    passwordResetToken: req.body.passwordResetToken,
    passwordResetExpires: req.body.passwordResetExpires,
  });

  const token = signToken(newUser._id);
  // console.log(token);

  // Send email to client
  try {
    const URL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/signup/${token}`;

    await new Email(newUser, URL).sendValid();

    res.status(200).json({
      status: 'success',
      message: 'Token sent by email',
    });
  } catch (err) {
    // console.log(err);
    return next(
      new AppError('There was an error sending an email, try again later.', 500)
    );
  }
});

exports.confirmSignup = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists.
  const user = await User.findById(decoded.id).select('+validated');
  if (!user) {
    return next(
      new AppError('The user belonging to this token does not exist.', 401)
    );
  }
  if (user.validated) {
    return next(new AppError('This account has already been validated', 400));
  }
  user.validated = true;
  await user.save({ validateBeforeSave: false });

  // Send the welcoming email
  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);
  await new Email(user, url).sendWelcome();

  createSendToken(user, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if the email and password exists
  if (!email || !password) {
    return next(
      new AppError('Please provide the email address and password!', 400) // Bad Request
    );
  }

  // 2) Check if the user exists && the password is correct
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401)); // Unauthorized
  }

  // 3) If everything goes well, send the token to the client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// Check whether the user has logged in
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get the token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);

  if (!token) {
    return next(
      new AppError(
        'You are not logged in! Please log in to get the access.',
        401
      )
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token is issued
  // if the user has changed the password, which means the function returns true
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed the password! Please login again.',
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  // We can use req.user in the next middleware
  req.user = freshUser;
  res.locals.user = freshUser;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return next();
      }

      // 3) Check if user changed password after the token is issued
      // if the user has changed the password, which means the function returns true
      if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      // We can use user variable in all the pug templates
      res.locals.user = freshUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide'], role='user'
    // this middleware performs after the protect one, where the req.user=freshUser
    if (!roles.includes(req.user.role)) {
      // 403=Forbidden Error
      return next(
        new AppError(
          'You do not have the permission to perform this action!',
          403
        )
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address!', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send this reset token to the user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    // If there is an error sending the email, reset the 2 field of the user object and send the error to the client
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Please try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If the token has not expired & the user exists, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  // Set the password and passwordConfirm fields
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  // Delete the passwordResetToken and passwordResetExpires fields
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // Save the updates
  await user.save();

  // 3) Update passwordChangedAt property for the user
  // Has completed in the pre-save middleware

  // 4) Log the user in, send the JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user._id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(
      new AppError('Current password is wrong. Please try again!', 401)
    );
  }

  // 3) If so, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in, send the JWT
  createSendToken(user, 200, res);
});
