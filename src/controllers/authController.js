const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');

// JWT to Authenticate logged in users
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

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
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
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
