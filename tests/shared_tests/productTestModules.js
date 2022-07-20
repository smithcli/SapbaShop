const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('../../src/models/productModel');

const allProducts = JSON.parse(
  fs.readFileSync(`${process.cwd()}/tests/data/products.json`, 'utf8')
);

allProducts.map((item) => {
  item._id = new mongoose.Types.ObjectId();
});

exports.addProducts = async () => {
  await Product.create(allProducts);
};
