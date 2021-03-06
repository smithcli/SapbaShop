const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const { housePro } = require('../shared_tests/productTestModules');

process.env.TEST_SUITE = 'test-getProduct';

describe(`GET /products/:id (test-getProduct)`, () => {
  const id = housePro._id;
  const route = `${utm.api}/products/${id}`;

  it('Should allow anonymous access', async () => {
    const res = await request(app).get(route).expect(200);
    expect(res.body.data.product).toMatchObject(housePro);
  });

  it('Should auth Customers access', async () => {
    const res = await request(app)
      .get(route)
      .set('cookie', await utm.jwtCustomer())
      .expect(200);
    expect(res.body.data.product).toMatchObject(housePro);
  });

  it('Should auth Employees access', async () => {
    const res = await request(app)
      .get(route)
      .set('cookie', await utm.jwtEmployee())
      .expect(200);
    expect(res.body.data.product).toMatchObject(housePro);
  });

  it('Should auth Managers access', async () => {
    const res = await request(app)
      .get(route)
      .set('cookie', await utm.jwtManager())
      .expect(200);
    expect(res.body.data.product).toMatchObject(housePro);
  });

  it('Should auth Admin access', async () => {
    const res = await request(app)
      .get(route)
      .set('cookie', await utm.jwtAdmin())
      .expect(200);
    expect(res.body.data.product).toMatchObject(housePro);
  });
});
