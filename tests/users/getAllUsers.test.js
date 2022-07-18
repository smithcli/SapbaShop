const request = require('supertest');
const app = require('../../src/app');
const utm = require('./userTestModules');
const db = require('../dbHandler');

beforeAll(async () => {
  await db.dbConnect('getAllUsers');
  await utm.addUsers();
});

afterAll(async () => {
  await db.dbDisconnect();
});

describe(`GET /users`, () => {
  const route = `${utm.api}/users`;
  const loginRoute = `${utm.api}/users/login`;

  it('Should NOT allow un-authenticated users access', async () => {
    const res = await request(app).get(route);
    expect(401);
    expect(res.body.message).toBe(
      'You are not logged in. Please log in to get access.'
    );
  });

  it('Should NOT allow auth Customers access', async () => {
    const loginRes = await request(app).post(loginRoute).send({
      email: utm.userCustomer.email,
      password: utm.userCustomer.password,
    });
    const jwt = utm.verifyJWTCookie(loginRes);
    const getRes = await request(app).get(route).set('cookie', jwt);
    expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('Should auth Employees access', async () => {
    const loginRes = await request(app).post(loginRoute).send({
      email: utm.userEmployee.email,
      password: utm.userEmployee.password,
    });
    const jwt = utm.verifyJWTCookie(loginRes);
    await request(app).get(route).set('cookie', jwt);
    expect(200);
  });

  it('Should auth Managers access', async () => {
    const loginRes = await request(app).post(loginRoute).send({
      email: utm.userManager.email,
      password: utm.userManager.password,
    });
    const jwt = utm.verifyJWTCookie(loginRes);
    await request(app).get(route).set('cookie', jwt);
    expect(200);
  });

  it('Should auth Admin access', async () => {
    const loginRes = await request(app).post(loginRoute).send({
      email: utm.userAdmin.email,
      password: utm.userAdmin.password,
    });
    const jwt = utm.verifyJWTCookie(loginRes);
    await request(app).get(route).set('cookie', jwt);
    expect(200);
  });
});
