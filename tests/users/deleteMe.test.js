const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const auth = require('../shared_tests/authTests');
const User = require('../../src/models/userModel');

process.env.TEST_SUITE = 'test-deleteMe';

const verifyNotActive = async (id) => {
  expect(await User.findById(id)).toBeNull();
};

describe(`DELETE /users/me (test-deleteMe)`, () => {
  const route = `${utm.api}/users/me`;
  const req = 'delete';

  auth.reqAuth(req, route);

  it('Should auth Customers access', async () => {
    await request(app)
      .delete(route)
      .set('cookie', await utm.jwtCustomer())
      .expect(204);
    await verifyNotActive(utm.userCustomer._id);
  });

  it('Should auth Employees access', async () => {
    await request(app)
      .delete(route)
      .set('cookie', await utm.jwtEmployee())
      .expect(204);
    await verifyNotActive(utm.userEmployee._id);
  });

  it('Should auth Managers access', async () => {
    await request(app)
      .delete(route)
      .set('cookie', await utm.jwtManager())
      .expect(204);
    await verifyNotActive(utm.userManager._id);
  });

  it('Should auth Admin access', async () => {
    await request(app)
      .delete(route)
      .set('cookie', await utm.jwtAdmin())
      .expect(204);
    await verifyNotActive(utm.userAdmin._id);
  });
});
