const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const auth = require('../shared_tests/authTests');

process.env.TEST_SUITE = 'test-getUser';

describe(`GET /users/:id (test-getUser)`, () => {
  const id = utm.userCustomerTwo._id;
  const route = `${utm.api}/users/${id}`;
  const req = 'get';

  auth.reqAuth(req, route);
  auth.noCustomerAuth(req, route);

  it('Should auth Employees access', async () => {
    const getRes = await request(app)
      .get(route)
      .set('cookie', await utm.jwtEmployee())
      .expect(200);
    expect(getRes.body.data.user.email).toBe(utm.userCustomerTwo.email);
  });

  it('Should auth Managers access', async () => {
    const getRes = await request(app)
      .get(route)
      .set('cookie', await utm.jwtManager())
      .expect(200);
    expect(getRes.body.data.user.email).toBe(utm.userCustomerTwo.email);
  });

  it('Should auth Admin access', async () => {
    const getRes = await request(app)
      .get(route)
      .set('cookie', await utm.jwtAdmin())
      .expect(200);
    expect(getRes.body.data.user.email).toBe(utm.userCustomerTwo.email);
  });
});
