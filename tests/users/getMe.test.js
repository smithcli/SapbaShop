const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const auth = require('../shared_tests/authTests');

process.env.TEST_SUITE = 'test-getMe';

describe(`GET /users/me (test-getMe)`, () => {
  const route = `${utm.api}/users/me`;
  const req = 'get';

  auth.reqAuth(req, route);

  it('Should auth Customers access', async () => {
    const getRes = await request(app)
      .get(route)
      .set('cookie', await utm.jwtCustomer())
      .expect(200);
    utm.checkUserResponse(getRes, utm.userCustomer);
  });

  it('Should auth Employees access', async () => {
    const getRes = await request(app)
      .get(route)
      .set('cookie', await utm.jwtEmployee())
      .expect(200);
    utm.checkUserResponse(getRes, utm.userEmployee);
  });

  it('Should auth Managers access', async () => {
    const getRes = await request(app)
      .get(route)
      .set('cookie', await utm.jwtManager())
      .expect(200);
    utm.checkUserResponse(getRes, utm.userManager);
  });

  it('Should auth Admin access', async () => {
    const getRes = await request(app)
      .get(route)
      .set('cookie', await utm.jwtAdmin())
      .expect(200);
    utm.checkUserResponse(getRes, utm.userAdmin);
  });
});
