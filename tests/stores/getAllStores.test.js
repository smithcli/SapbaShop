const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');

process.env.TEST_SUITE = 'test-getAllStores';

describe(`GET /stores (test-getAllStores)`, () => {
  const route = `${utm.api}/stores`;

  it('Should allow anonymous access', async () => {
    await request(app).get(route).expect(200);
  });

  it('Should auth Customers access', async () => {
    await request(app)
      .get(route)
      .set('cookie', await utm.jwtCustomer())
      .expect(200);
  });

  it('Should auth Employees access', async () => {
    await request(app)
      .get(route)
      .set('cookie', await utm.jwtEmployee())
      .expect(200);
  });

  it('Should auth Managers access', async () => {
    await request(app)
      .get(route)
      .set('cookie', await utm.jwtManager())
      .expect(200);
  });

  it('Should auth Admin access', async () => {
    await request(app)
      .get(route)
      .set('cookie', await utm.jwtAdmin())
      .expect(200);
  });
});
