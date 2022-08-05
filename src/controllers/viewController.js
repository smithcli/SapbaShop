const Product = require('../models/productModel');
const Store = require('../models/storeModel');
const Users = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render('page/login');
});

exports.getDashboard = catchAsync(async (req, res, next) => {
  // 1) Dashboard is determined by user role
  if (req.user.role === 'admin') {
    const stores = await Store.find().lean();
    res.status(200).render('page/adminDashboard', {
      title: 'Admin Dashboard',
      stores,
    });
  }
  if (req.user.role === 'manager') {
    const stores = await Store.find({ _id: req.user.store }).lean();
    res.status(200).render('page/managerDashboard', {
      title: 'Manager Dashboard',
      stores,
    });
  }
});

// Place to Add, Modify, Delete all products.
exports.getProducts = catchAsync(async (req, res, next) => {
  const query = {
    _id: '$name.en',
    slug: { $first: '$slug' },
    nameTh: { $first: '$name.th' },
    departmentEn: { $first: '$department.en' },
    departmentTh: { $first: '$department.th' },
  };
  // TODO: Add Thai support for sort order.
  const products = await Product.aggregate().group(query).sort({ slug: 1 });
  res.status(200).render('page/products', {
    title: 'SapbaShop Products',
    products,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.find({ slug: req.params.slug });
  const stores = await Store.find().lean();
  const sizes = await Product.schema.path('size').enumValues;
  res.status(200).render('page/products', {
    title: 'SapbaShop Products',
    product,
    stores,
    sizes,
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

exports.getStore = catchAsync(async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });
  res.status(200).render('page/stores', {
    title: 'SapbaShop Stores',
    store,
  });
});

exports.addStore = (req, res) => {
  res.status(200).render('page/stores', {
    title: 'SapbaShop Stores',
  });
};

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await Users.find().lean();
  res.status(200).render('page/users', {
    title: 'SapbaShop Users',
    users,
  });
});
