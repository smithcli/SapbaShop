const request = require('supertest');
const app = require('../../src/app');
const utm = require('./userTestModules');
const { reqAuth } = require('../shared_tests/reqAuth');

process.env.TEST_SUITE = 'test-getUser';

describe(`GET /users/:id (test-getUser)`, () => {
  const id = utm.userCustomerTwo._id;
  const route = `${utm.api}/users/${id}`;

  reqAuth('get', route);

  it('Should NOT allow auth Customers access', async () => {
    const jwt = await utm.getJWT(utm.userCustomer);
    const getRes = await request(app).get(route).set('cookie', jwt).expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('Should auth Employees access', async () => {
    const jwt = await utm.getJWT(utm.userEmployee);
    const getRes = await request(app).get(route).set('cookie', jwt).expect(200);
    expect(getRes.body.data.user.email).toBe(utm.userCustomerTwo.email);
  });

  it('Should auth Managers access', async () => {
    const jwt = await utm.getJWT(utm.userManager);
    const getRes = await request(app).get(route).set('cookie', jwt).expect(200);
    expect(getRes.body.data.user.email).toBe(utm.userCustomerTwo.email);
  });

  it('Should auth Admin access', async () => {
    const jwt = await utm.getJWT(utm.userAdmin);
    const getRes = await request(app).get(route).set('cookie', jwt).expect(200);
    expect(getRes.body.data.user.email).toBe(utm.userCustomerTwo.email);
  });
});
