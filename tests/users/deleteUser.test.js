const request = require('supertest');
const app = require('../../src/app');
const utm = require('./userTestModules');
const mongoose = require('mongoose');
const { reqAuth } = require('../shared_tests/reqAuth');

process.env.TEST_SUITE = 'test-deleteUser';

describe(`DELETE /users/:id (test-deleteUser)`, () => {
  const id = utm.userEmployee._id;
  const route = `${utm.api}/users/${id}`;

  reqAuth('delete', route);

  it('Should NOT allow auth Customers access', async () => {
    const jwt = await utm.getJWT(utm.userCustomer);
    const getRes = await request(app)
      .delete(route)
      .set('cookie', jwt)
      .expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('Should NOT allow Employees access', async () => {
    const jwt = await utm.getJWT(utm.userEmployee);
    const getRes = await request(app)
      .delete(route)
      .set('cookie', jwt)
      .expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('Should NOT allow Managers access', async () => {
    const jwt = await utm.getJWT(utm.userManager);
    const getRes = await request(app)
      .delete(route)
      .set('cookie', jwt)
      .expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('Should allow Admin to delete user', async () => {
    const jwt = await utm.getJWT(utm.userAdmin);
    const getRes = await request(app)
      .delete(route)
      .set('cookie', jwt)
      .expect(204);
  });

  it('Should throw CastError with invalid Id', async () => {
    const invalidID = '62cdfe320bb1f4d7cfd9c7c';
    const jwt = await utm.getJWT(utm.userAdmin);
    const getRes = await request(app)
      .delete(`${utm.api}/users/${invalidID}`)
      .set('cookie', jwt)
      .expect(400);
    expect(getRes.body.message).toBe('Invalid _id: 62cdfe320bb1f4d7cfd9c7c');
  });
});
