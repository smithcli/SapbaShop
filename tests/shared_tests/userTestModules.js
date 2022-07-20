const fs = require('fs');
const request = require('supertest');
const app = require('../../src/app');
const cookieParser = require('cookie-parse');
const User = require('../../src/models/userModel');

exports.api = process.env.API_VERSION;

exports.verifyJWTCookie = (response) => {
  const cookie = cookieParser.parse(response.headers['set-cookie'][0]);
  expect(cookie).toHaveProperty('jwt');
  expect(cookie).toHaveProperty('HttpOnly', 'true');
  expect(cookie).toHaveProperty('Secure', 'true');
  const expectedExp = new Date();
  const expDate = process.env.JWT_EXPIRES_IN.substring(0, 2) * 1;
  expectedExp.setUTCDate(expectedExp.getUTCDate() + expDate);
  const actualExp = new Date(cookie.Expires).toLocaleDateString();
  expect(actualExp).toEqual(expectedExp.toLocaleDateString());
  return `jwt=${cookie.jwt}`;
};

exports.getJWT = async (user) => {
  const loginRoute = `${this.api}/users/login`;
  const loginRes = await request(app).post(loginRoute).send({
    email: user.email,
    password: user.password,
  });
  return this.verifyJWTCookie(loginRes);
};

exports.jwtCustomer = async () => {
  return await this.getJWT(this.userCustomer);
};

exports.jwtEmployee = async () => {
  return await this.getJWT(this.userEmployee);
};

exports.jwtManager = async () => {
  return await this.getJWT(this.userManager);
};

exports.jwtAdmin = async () => {
  return await this.getJWT(this.userAdmin);
};

const allUsers = JSON.parse(
  fs.readFileSync(`${process.cwd()}/tests/data/users.json`, 'utf8')
);

exports.addUsers = async () => {
  await User.create(allUsers);
};

exports.userAdmin = allUsers[0];
exports.userManager = allUsers[1];
exports.userEmployee = allUsers[2];
exports.userCustomer = allUsers[3];
exports.userCustomerTwo = allUsers[4];

exports.checkUserResponse = (res, userTest) => {
  expect(res.body.data.user).toHaveProperty('_id');
  expect(res.body.data.user).toHaveProperty('store', userTest.store);
  expect(res.body.data.user).toHaveProperty('role', userTest.role);
  expect(res.body.data.user).toHaveProperty('name', userTest.name);
  expect(res.body.data.user).toHaveProperty('email', userTest.email);
  expect(res.body.data.user).not.toHaveProperty('password');
  expect(res.body.data.user).not.toHaveProperty('passwordConfirm');
  expect(res.body.data.user).not.toHaveProperty('active');
};
