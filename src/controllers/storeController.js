const Store = require('../models/storeModel');

exports.getAllStores = async (req, res, next) => {
  const stores = await Store.find()
  res.status(200).json({
    status: 'success',
    data: {
      stores,
    }
  })
}

exports.createStore = async (req, res, next) => {
  const newStore = await Store.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      store: newStore,
    },
  });
};
