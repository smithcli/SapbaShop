const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const cookieParser = require('cookie-parse');

const api = '/api/v1/users';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_DATABASE_URL);
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
});

const userOne = {
  name: 'john One',
  email: 'john@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};

const userTwo = {
  name: 'john Two',
  email: 'john@sapbashop.com',
  password: 'pass12345',
  passwordConfirm: 'pass12345',
};

const verifyJWTCookie = (response) => {
  const cookie = cookieParser.parse(response.headers['set-cookie'][0]);
  expect(cookie).toHaveProperty('jwt');
  expect(cookie).toHaveProperty('HttpOnly', 'true');
  expect(cookie).toHaveProperty('Secure', 'true');
  const expectedExp = new Date();
  const expDate = process.env.JWT_EXPIRES_IN.substring(0, 2) * 1;
  expectedExp.setUTCDate(expectedExp.getUTCDate() + expDate);
  expect(cookie).toHaveProperty('Expires', expectedExp.toUTCString());
};

describe(`POST ${api}/signup Tests`, () => {
  test('Should signup a new user and get JWT Cookie', async () => {
    const response = await request(app).post(`${api}/signup`).send(userOne);
    expect(201);
    expect(response.body.data.user).toHaveProperty('name', userOne.name);
    expect(response.body.data.user).toHaveProperty('email', userOne.email);
    verifyJWTCookie(response);
  });

  test('Should not allow user to sign up with existing email', async () => {
    const response = await request(app).post(`${api}/signup`).send(userTwo);
    expect(400);
    expect(response.body).toHaveProperty('status', 'fail');
    expect(response.body).toHaveProperty(
      'message',
      `${userTwo.email} already exists. Please use another value.`
    );
  });
});
