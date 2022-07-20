const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const stm = require('../shared_tests/storeTestModules');
const auth = require('../shared_tests/authTests');

process.env.TEST_SUITE = 'test-deleteStore';

describe(`DELETE /stores/:id (test-deleteStore)`, () => {
  const id = stm.storeOne._id;
  const route = `${utm.api}/stores/${id}`;
  const req = 'delete';

  auth.reqAuth(req, route);
  auth.noCustomerAuth(req, route);
  auth.noEmployeeAuth(req, route);
  auth.noManagerAuth(req, route);

  it('Should allow Admin to delete user', async () => {
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
