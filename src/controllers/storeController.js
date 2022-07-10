const Store = require('../models/storeModel');

exports.getAllStores = async (req, res, next) => {
  const stores = await Store.find();
  res.status(200).json({
    status: 'success',
    data: {
      stores,
    },
  });
};

exports.getStore = async (req, res, next) => {
  const store = await Store.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      store,
    },
  });
};

exports.createStore = async (req, res, next) => {
  const newStore = await Store.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      store: newStore,
    },
  });
};

exports.updateStore = async (req, res, next) => {
  const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

exports.deleteStore = async (req, res, next) => {
  const store = await Store.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
