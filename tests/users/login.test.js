const request = require('supertest');
const app = require('../../src/app');
const utm = require('./userTestModules');
const db = require('../dbHandler');

beforeAll(async () => {
  await db.dbConnect('login');
  await utm.addUsers();
});

afterAll(async () => {
  await db.dbDisconnect();
});

describe(`POST /users/login Tests`, () => {
  const route = `${utm.api}/users/login`;

  it('Should login an existing user', async () => {
    const res = await request(app).post(route).send({
      email: utm.userAdmin.email,
      password: utm.userAdmin.password,
    });
    expect(200);
    expect(res.body.data.user._id).toBe(utm.userAdmin._id.toString());
    utm.verifyJWTCookie(res);
  });

  it('Should return 401 for a non existing user', async () => {
    const res = await request(app).post(route).send({
      email: 'notHere@sapba.com',
      password: 'pass1234',
    });
    expect(401);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toBe('Incorrect email or password');
  });

  it('Should return 401 for a incorrect password', async () => {
    const res = await request(app).post(route).send({
      email: utm.userAdmin.email,
      password: 'incorrectpass',
    });
    expect(401);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toBe('Incorrect email or password');
  });
});
