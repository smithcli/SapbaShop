const Product = require('../models/productModel');
const Store = require('../models/storeModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render('login')
})

exports.getDashboard = catchAsync(async (req, res, next) => {
  // 1) determine user for which dashbaord
  // req.user ?
  // 2) get data from collection
  const products = await Product.find().populate('store');
  const stores = await Store.find();
  // 3) build template
  // 4) render template using data
  res.status(200).render('adminDashboard', {
    title: 'Admin Dashboard',
    products,
    stores,
  });
});
