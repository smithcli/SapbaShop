const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/userModel');
const { api, verifyJWTCookie } = require('./userTestModules');
const mongoose = require('mongoose');

const userOne = {
  name: 'signupuser',
  email: 'signupuser@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_DATABASE_URL);
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe(`POST /users/signup Tests`, () => {
  const route = `${api}/users/signup`;

  it('Should signup a new user and get JWT Cookie', async () => {
    const response = await request(app).post(route).send(userOne);
    expect(201);
    expect(response.body.data.user).toHaveProperty('name', userOne.name);
    expect(response.body.data.user).toHaveProperty('email', userOne.email);
    verifyJWTCookie(response);
  });

  it('Should not allow user to sign up with existing email', async () => {
    const response = await request(app).post(route).send({
      name: 'john two',
      email: userOne.email,
      password: userOne.password,
      passwordConfirm: userOne.passwordConfirm,
    });
    expect(400);
    expect(response.body).toHaveProperty('status', 'fail');
    expect(response.body).toHaveProperty(
      'message',
      `${userOne.email} already exists. Please use another value.`
    );
  });
});
