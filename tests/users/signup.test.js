const request = require('supertest');
const app = require('../../src/app');
const db = require('../dbHandler');
const utm = require('./userTestModules');

const userOne = {
  name: 'new customer',
  email: 'newcustomer@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};

beforeAll(async () => {
  await db.dbConnect('signup');
  await utm.addUsers();
});

afterAll(async () => {
  await db.dbDisconnect();
});

describe(`POST /users/signup Tests`, () => {
  const route = `${utm.api}/users/signup`;

  it('Should signup a new user and get JWT Cookie', async () => {
    const response = await request(app).post(route).send(userOne);
    expect(201);
    expect(response.body.data.user).toHaveProperty('name', userOne.name);
    expect(response.body.data.user).toHaveProperty('email', userOne.email);
    utm.verifyJWTCookie(response);
  });

  it('Should not allow user to sign up with existing email', async () => {
    const response = await request(app).post(route).send({
      name: 'new customer',
      email: utm.userCustomer.email,
      password: 'pass1234',
      passwordConfirm: 'pass1234',
    });
    expect(400);
    expect(response.body).toHaveProperty('status', 'fail');
    expect(response.body).toHaveProperty(
      'message',
      `${utm.userCustomer.email} already exists. Please use another value.`
    );
  });
});
