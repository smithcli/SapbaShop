const Product = require('../models/productModel');
const Store = require('../models/storeModel');
const Users = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render('page/login');
});

exports.getDashboard = catchAsync(async (req, res, next) => {
  // 1) determine user for which dashbaord
  // req.user ? admin = adminDashboard etc
  const stores = await Store.find().lean();
  res.status(200).render('page/adminDashboard', {
    title: 'Admin Dashboard',
    stores,
  });
});

// TODO: Add to get Dashboard once development is complete.
exports.getManager = catchAsync(async (req, res, next) => {
  const stores = await Store.find({ _id: '62d7448a42bc72ecc8a0726c' }).lean();
  res.status(200).render('page/managerDashboard', {
    title: 'Manager Dashboard',
    stores,
  });
});

// Place to Add, Modify, Delete all products.
exports.getProducts = catchAsync(async (req, res, next) => {
  const query = {
    _id: '$name.en',
    slug: {
      $first: '$slug',
    },
    nameTh: {
      $first: '$name.th',
    },
    departmentEn: {
      $first: '$department.en',
    },
    departmentTh: {
      $first: '$department.th',
    },
  };
  // TODO: Thai support for sort order.
  const products = await Product.aggregate().group(query).sort({ slug: 1 });
  res.status(200).render('page/products', {
    title: 'SapbaShop Products',
    products,
  });
});

// Place to Add, Modify, Delete all stores.
exports.getStores = catchAsync(async (req, res, next) => {
  const stores = await Store.find().lean();
  res.status(200).render('page/stores', {
    title: 'SapbaShop Stores',
    stores,
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await Users.find().lean();
  res.status(200).render('page/users', {
    title: 'SapbaShop Users',
    users,
  });
});
