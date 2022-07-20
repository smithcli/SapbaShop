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

exports.checkProperties = (product, testProduct) => {
  expect(product).toHaveProperty('_id');
  expect(decodeURI(product.store)).toBe(testProduct.store);
  expect(product.department).toMatchObject(testProduct.department);
  expect(product.name).toMatchObject(testProduct.name);
  expect(product.description).toMatchObject(testProduct.description);
  expect(product.price).toBe(testProduct.price);
  expect(product.unit).toMatchObject(testProduct.unit);
  expect(product.size).toBe(testProduct.size);
  expect(product.count).toBe(testProduct.count);
  expect(product).toHaveProperty('images');
  expect(product).toHaveProperty('tags');
};
