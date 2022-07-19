const request = require('supertest');
const app = require('../../src/app');
const utm = require('./userTestModules');
const { reqAuth } = require('../shared_tests/reqAuth');

process.env.TEST_SUITE = 'test-getAllUsers';

describe(`GET /users (test-getAllUsers)`, () => {
  const route = `${utm.api}/users`;

  reqAuth('get', route);

  it('Should NOT allow auth Customers access', async () => {
    const jwt = await utm.getJWT(utm.userCustomer);
    const getRes = await request(app).get(route).set('cookie', jwt);
    expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('Should auth Employees access', async () => {
    const jwt = await utm.getJWT(utm.userEmployee);
    await request(app).get(route).set('cookie', jwt).expect(200);
  });

  it('Should auth Managers access', async () => {
    const jwt = await utm.getJWT(utm.userManager);
    await request(app).get(route).set('cookie', jwt).expect(200);
  });

  it('Should auth Admin access', async () => {
    const jwt = await utm.getJWT(utm.userAdmin);
    await request(app).get(route).set('cookie', jwt).expect(200);
  });
});
