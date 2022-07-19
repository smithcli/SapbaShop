const request = require('supertest');
const app = require('../../src/app');
const db = require('../dbHandler');
const utm = require('./userTestModules');

const userSignup = {
  name: 'signup customer',
  email: 'signup_customer@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};

beforeAll(async () => {
  // param is the db name = test-action, must be unqiue for Jest concurrency
  await db.dbConnect('test-signup');
  await utm.addUsers();
});

afterAll(async () => {
  await db.dbDisconnect();
});

describe(`POST /users/signup (test-signup)`, () => {
  const route = `${utm.api}/users/signup`;

  it('Should signup a new user and get JWT Cookie', async () => {
    const response = await request(app)
      .post(route)
      .send(userSignup)
      .expect(201);
    expect(response.body.data.user).toHaveProperty('name', userSignup.name);
    expect(response.body.data.user).toHaveProperty('email', userSignup.email);
    utm.verifyJWTCookie(response);
  });

  it('Should not allow user to sign up with existing email', async () => {
    const response = await request(app)
      .post(route)
      .send({
        name: 'blocked signup customer',
        email: utm.userCustomer.email,
        password: 'pass1234',
        passwordConfirm: 'pass1234',
      })
      .expect(400);
    expect(response.body).toHaveProperty(
      'message',
      `${utm.userCustomer.email} already exists. Please use another value.`
    );
  });
});
