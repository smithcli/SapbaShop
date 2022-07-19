const request = require('supertest');
const app = require('../../src/app');
const utm = require('./userTestModules');
const db = require('../dbHandler');

beforeAll(async () => {
  await db.dbConnect('test-getAllUsers');
  await utm.addUsers();
});

afterAll(async () => {
  await db.dbDisconnect();
});

describe(`GET /users (test-getAllUsers)`, () => {
  const route = `${utm.api}/users`;

  it('Should NOT allow un-authenticated users access', async () => {
    const res = await request(app).get(route).expect(401);
    expect(res.body.message).toBe(
      'You are not logged in. Please log in to get access.'
    );
  });

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
