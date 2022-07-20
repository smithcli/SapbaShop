const fs = require('fs');
const Product = require('../../src/models/productModel');

const allProducts = JSON.parse(
  fs.readFileSync(`${process.cwd()}/tests/data/products.json`, 'utf8')
);

exports.addProducts = async () => {
  await Product.create(allProducts);
};

exports.groceryPro = allProducts[0];
exports.clothPro = allProducts[18];
exports.personalPro = allProducts[47];
exports.wellnessPro = allProducts[60];
exports.housePro = allProducts[70];
