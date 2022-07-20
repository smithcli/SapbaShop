const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const auth = require('../shared_tests/authTests');

process.env.TEST_SUITE = 'test-getAllUsers';

describe(`GET /users (test-getAllUsers)`, () => {
  const route = `${utm.api}/users`;
  const req = 'get';

  auth.reqAuth(req, route);
  auth.noCustomerAuth(req, route);

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
