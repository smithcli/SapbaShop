const fs = require('fs');
const Product = require('../../src/models/productModel');

const allProducts = JSON.parse(
  fs.readFileSync(`${process.cwd()}/tests/data/products.json`, 'utf8')
);

exports.addProducts = async () => {
  await Product.create(allProducts);
};
