const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');
const sendmail = require('../utils/email');

// JWT to Authenticate logged in users
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// Send JWT as httpOnly cookie
const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // HTTPS only
    secure: true,
    // Mitigate XSS attacks
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'development') cookieOptions.secure = false;
  user.password = undefined;
  user.active = undefined;
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
    },
  });
};

// Create hashed token for reset password
const hashedToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Allows customers to sign up. Employees should be created by the Admin
exports.signup = catchAsync(async (req, res, next) => {
  // Prevent new user / customer from being able to inject roles
  const newUser = await User.create({
    store: req.body.store,
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  sendToken(newUser, 201, res);
});

// Authenticate users
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Verify both email and password exist
  if (!email || !password) {
    return next(new AppError(400, 'Please provide email and password.'));
  }
  // 2) Find the user by email and get password
  const user = await User.findOne({ email }).select('+password');
  // 3) Verify user exists and Verify password matches
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError(401, 'Incorrect email or password'));
  }
  // 4) If correct send new JWT token.
  sendToken(user, 200, res);
});

// Users are required to be logged in to access routes with this middleware
exports.requireAuth = catchAsync(async (req, res, next) => {
  // 1) get token
  let token;
  if (req.headers.cookie && req.headers.cookie.startsWith('jwt')) {
    token = req.headers.cookie.split('=')[1];
  } else {
    return next(
      new AppError(401, 'You are not logged in. Please log in to get access.')
    );
  }
  // 2) verify token and expiration
  const jwtDecoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const user = await User.findById(jwtDecoded.id);
  if (!user) {
    return next(new AppError(401, 'This user no longer exists.'));
  }
  // 4) Check if user changed password
  if (user.changedPasswordAfter(jwtDecoded.iat)) {
    return next(new AppError(401, 'Invalid token. Please log in again.'));
  }
  // 5) Grant access and attach user to req for further middleware
  req.user = user;
  next();
});

// Users are required to be specified roles to access routes with this middleware
exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, 'You do not have permission to perform this action.')
      );
    }
    next();
  };
};

// Users forgot password, sends email with token
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user by email in request
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(404, 'Could not find this account.'));
  }
  // 2) Generate Reset Token
  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send email to user
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  //TODO: Change message after front-end developed to allow html
  const message = `Forgot your Password?\n<PATCH with pass & pass confirm> at: ${resetURL}\nIf you didnt, please ignore this email.`;
  try {
    await sendmail({
      to: user.email,
      subject: 'SapbaShop Password Reset Token',
      text: message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to your email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        500,
        'There was an error sending the email. Please try again later.'
      )
    );
  }
});

// Reset Users Password, requires token from email
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on token
  const user = await User.findOne({
    passwordResetToken: hashedToken(req.params.token),
  });
  // 2) Verify token is not expired
  if (!user || Date.now() > user.passwordResetExpires) {
    return next(new AppError(400, 'Token is invalid or expired.'));
  }
  // 3) Set new password
  console.log(req.body);
  user.changePassword(req.body.password, req.body.passwordConfirm);
  await user.save();
  // 4) log in the user, send jwt
  sendToken(user, 200, res);
});

// Update Password for Users that are logged in.
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from db
  const user = await User.findById(req.user._id).select('+password');
  // 2) Require Current password and verify
  if (!(await user.checkPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError(401, 'Current password is incorrect.'));
  }
  // 3) Update user with new password
  user.changePassword(req.body.password, req.body.passwordConfirm);
  await user.save();
  // 4) Send new jwt
  sendToken(user, 200, res);
});
