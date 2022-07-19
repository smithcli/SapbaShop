const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError(404, 'Could not find that User.'));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  if (newUser) {
    const { password, active, ...user } = newUser._doc;
    res.status(201).json({
      status: 'success',
      data: {
        user: user,
      },
    });
  }
});

exports.updateUser = catchAsync(async (req, res, next) => {
  // Admin should not change passwords directly. Users can use forgot password function.
  if (
    req.body.password ||
    req.body.passwordConfirm ||
    req.body.passwordChangedAt
  ) {
    return next(new AppError(400, 'This route is not for password updates.'));
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError(404, 'Could not find that User.'));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError(404, 'Could not find that User.'));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError(400, 'This route is not for password updates.'));
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      store: req.body.store,
      name: req.body.name,
      email: req.body.email,
      photo: req.body.photo,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    return next(new AppError(404, 'Could not find that User.'));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
