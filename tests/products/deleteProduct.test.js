const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const auth = require('../shared_tests/authTests');
const Product = require('../../src/models/productModel');
const ptm = require('../shared_tests/productTestModules');

process.env.TEST_SUITE = 'test-deleteProduct';

beforeEach(async () => {
  // Reset groceryPro in db
  if (!(await Product.findById(ptm.groceryPro._id))) {
    await Product.create(ptm.groceryPro);
  }
});

describe(`DELETE /products/:id (test-deleteProduct)`, () => {
  const id = ptm.groceryPro._id;
  const route = `${utm.api}/products/${id}`;
  const req = 'delete';

  auth.reqAuth(req, route);
  auth.noCustomerAuth(req, route);
  auth.noEmployeeAuth(req, route);

  it('Should allow Manager to delete product', async () => {
    await request(app)
      .delete(route)
      .set('cookie', await utm.jwtManager())
      .expect(204);
  });

  it('Should allow Admin to delete product', async () => {
    await request(app)
      .delete(route)
      .set('cookie', await utm.jwtAdmin())
      .expect(204);
  });

  it('Should throw CastError with invalid Id', async () => {
    const invalidID = '62cdfe320bb1f4d7cfd9c7c';
    const getRes = await request(app)
      .delete(`${utm.api}/users/${invalidID}`)
      .set('cookie', await utm.jwtAdmin())
      .expect(400);
    expect(getRes.body.message).toBe('Invalid _id: 62cdfe320bb1f4d7cfd9c7c');
  });
});
