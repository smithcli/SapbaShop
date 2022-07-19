const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const { reqAuth } = require('../shared_tests/reqAuth');

process.env.TEST_SUITE = 'test-getAllUsers';

describe(`GET /users (test-getAllUsers)`, () => {
  const route = `${utm.api}/users`;

  reqAuth('get', route);

  it('Should NOT allow auth Customers access', async () => {
    const getRes = await request(app)
      .get(route)
      .set('cookie', await utm.jwtCustomer())
      .expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
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
