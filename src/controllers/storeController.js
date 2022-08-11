const Store = require('../models/storeModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllStores = catchAsync(async (req, res, next) => {
  const stores = await Store.find();
  res.status(200).json({
    status: 'success',
    data: {
      total_results: stores.length,
      stores,
    },
  });
});

exports.getStore = catchAsync(async (req, res, next) => {
  const store = await Store.findById(req.params.id);
  if (!store) {
    return next(new AppError(404, `No store found with id: ${req.params.id}`));
  }
  res.status(200).json({
    status: 'success',
    data: {
      store,
    },
  });
});

exports.createStore = catchAsync(async (req, res, next) => {
  const newStore = await Store.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      store: newStore,
    },
  });
});

exports.updateStore = catchAsync(async (req, res, next) => {
  const store = await Store.findById(req.params.id);
  if (!store) {
    return next(new AppError(404, `No store found with id: ${req.params.id}`));
  }
  store.set(req.body).validate();
  const updatedStore = await Store.findByIdAndUpdate(req.params.id, store, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      store: updatedStore,
    },
  });
});

exports.deleteStore = catchAsync(async (req, res, next) => {
  const store = await Store.findByIdAndDelete(req.params.id);
  if (!store) {
    return next(new AppError(404, `No store found with id: ${req.params.id}`));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
