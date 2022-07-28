const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Store = require('../models/storeModel');
const APIFeatures = require('../utils/apiFeatures');

// Added APIFeatures to allow searches, paginate default is 1 of 100
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .selectFields()
    .paginate();
  const products = await features.query;
  res.status(200).json({
    status: 'success',
    data: {
      page: req.query.page || '0',
      limit_per_page: features.query.options.limit,
      total_results: products.length,
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new AppError(404, `No product found with id: ${req.params.id}`)
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(
      new AppError(404, `No product found with id: ${req.params.id}`)
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(
      new AppError(404, `No product found with id: ${req.params.id}`)
    );
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// No pagination for possible expensive call for management.
exports.getAllProductsMangement = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .selectFields();
  const products = await features.query;
  res.status(200).json({
    status: 'success',
    data: {
      total_results: products.length,
      products,
    },
  });
});
