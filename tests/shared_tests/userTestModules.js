const request = require('supertest');
const app = require('../../src/app');
const cookieParser = require('cookie-parse');
const mongoose = require('mongoose');
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

exports.addUsers = async () => {
  const testUsers = [
    this.userAdmin,
    this.userManager,
    this.userEmployee,
    this.userCustomer,
    this.userCustomerTwo,
  ];
  await User.create(testUsers);
};

exports.userAdmin = {
  _id: new mongoose.Types.ObjectId(),
  role: 'admin',
  name: 'admin',
  email: 'admin@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};

exports.userManager = {
  _id: new mongoose.Types.ObjectId(),
  role: 'manager',
  name: 'manager',
  email: 'manager@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};

exports.userEmployee = {
  _id: new mongoose.Types.ObjectId(),
  role: 'employee',
  name: 'employee',
  email: 'employee@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};

exports.userCustomer = {
  _id: new mongoose.Types.ObjectId(),
  role: 'customer',
  name: 'customer',
  email: 'customer@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};

exports.userCustomerTwo = {
  _id: new mongoose.Types.ObjectId(),
  role: 'customer',
  name: 'customertwo',
  email: 'customertwo@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};
