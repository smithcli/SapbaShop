const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
    secure: true,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'development') cookieOptions.secure = false;
  user.password = undefined;
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
};

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
