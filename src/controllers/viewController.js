const Product = require('../models/productModel');
const Store = require('../models/storeModel');
const User = require('../models/userModel');
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

exports.addProduct = catchAsync(async (req, res) => {
  const stores = await Store.find().lean();
  const sizes = Product.schema.path('size').enumValues;
  res.status(200).render('page/products', {
    title: 'SapbaShop Stores',
    stores,
    sizes,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.find({ slug: req.params.slug });
  const stores = await Store.find().lean();
  const sizes = Product.schema.path('size').enumValues;
  const prodIds = product.map((prod) => prod._id);
  res.status(200).render('page/products', {
    title: 'SapbaShop Products',
    product,
    prodIds,
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

exports.addStore = (req, res) => {
  res.status(200).render('page/stores', {
    title: 'SapbaShop Stores',
  });
};

exports.getStore = catchAsync(async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });
  res.status(200).render('page/stores', {
    title: 'SapbaShop Stores',
    store,
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await Users.find().lean().populate('store').sort({ role: 1 });
  res.status(200).render('page/users', {
    title: 'SapbaShop Users',
    users,
  });
});

exports.addUser = catchAsync(async (req, res) => {
  const stores = await Store.find().lean();
  const roles = User.schema.path('role').enumValues;
  res.status(200).render('page/users', {
    title: 'SapbaShop Stores',
    stores,
    roles,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const selectedUser = await Users.findOne({ slug: req.params.slug });
  const stores = await Store.find().lean();
  const roles = User.schema.path('role').enumValues;
  res.status(200).render('page/users', {
    title: 'SapbaShop Users',
    selectedUser,
    stores,
    roles,
  });
});
