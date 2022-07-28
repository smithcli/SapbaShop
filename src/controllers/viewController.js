const Product = require('../models/productModel');
const Store = require('../models/storeModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render('page/login');
});

exports.getDashboard = catchAsync(async (req, res, next) => {
  // 1) determine user for which dashbaord
  // req.user ? admin = adminDashboard etc
  const stores = await Store.find();
  res.status(200).render('page/adminDashboard', {
    title: 'Admin Dashboard',
    stores,
  });
});

// TODO: Add to get Dashboard once development is complete.
exports.getManager = catchAsync(async (req, res, next) => {
  const stores = await Store.find({ _id: '62d7448a42bc72ecc8a0726c' });
  res.status(200).render('page/managerDashboard', {
    title: 'Manager Dashboard',
    stores,
  });
});

// Place to Add, Modify, Delete all products.
exports.getProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().populate('store');
  res.status(200).render('page/products', {
    title: 'SapbaShop Products',
    products,
  });
});

// Place to Add, Modify, Delete all stores.
exports.getStores = catchAsync(async (req, res, next) => {
  const stores = await Store.find();
  res.status(200).render('page/stores', {
    title: 'SapbaShop Stores',
    stores,
  });
});


// TODO: Place to Add, Modify, Delete all users.
