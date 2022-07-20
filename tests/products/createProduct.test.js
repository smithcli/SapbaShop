const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const auth = require('../shared_tests/authTests');
const ptm = require('../shared_tests/productTestModules');
const Product = require('../../src/models/productModel');

process.env.TEST_SUITE = 'test-createProduct';

beforeAll(async () => {
  await Product.findByIdAndDelete(ptm.groceryPro._id);
});

let productTest;
beforeEach(async () => {
  const { _id, ...product } = ptm.groceryPro;
  productTest = Object.assign({}, product)
});

describe(`POST /products (test-createProduct)`, () => {
  const route = `${utm.api}/products`;
  const req = 'post';

  auth.reqAuth(req, route, productTest);
  auth.noCustomerAuth(req, route, productTest);
  auth.noEmployeeAuth(req, route, productTest);

  it('Should allow Manager to create product', async () => {
    const getRes = await request(app)
      .post(route)
      .set('cookie', await utm.jwtManager())
      .send(productTest)
      .expect(201);
    ptm.checkProperties(getRes.body.data.product, productTest);
  });

  it('Should allow Admin to create product', async () => {
    const getRes = await request(app)
      .post(route)
      .set('cookie', await utm.jwtAdmin())
      .send(productTest)
      .expect(201);
    ptm.checkProperties(getRes.body.data.product, productTest);
  });
});
