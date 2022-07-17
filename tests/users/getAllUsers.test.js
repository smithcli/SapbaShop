const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/userModel');
const { api, verifyJWTCookie } = require('./userTestModules');
const mongoose = require('mongoose');

const userAdmin = {
  role: 'admin',
  name: 'admin',
  email: 'getallusersadmin@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};

const userManager = {
  role: 'manager',
  name: 'manager',
  email: 'getallusersmanager@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};

const userEmployee = {
  role: 'employee',
  name: 'employee',
  email: 'getallusersemployee@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};

const userCustomer = {
  role: 'customer',
  name: 'customer',
  email: 'getalluserscustomer@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};
const testUsers = [userAdmin, userManager, userEmployee, userCustomer];

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_DATABASE_URL);
  await User.deleteMany({});
  await User.create(testUsers, { validateBeforeSave: false });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe(`GET /users`, () => {
  const route = `${api}/users`;
  it('Should NOT allow un-authenticated users access', async () => {
    const res = await request(app).get(route);
    expect(401);
    expect(res.body.message).toBe(
      'You are not logged in. Please log in to get access.'
    );
  });

  it('Should NOT allow auth Customers access', async () => {
    const loginRes = await request(app).post(`${api}/users/login`).send({
      email: userCustomer.email,
      password: userCustomer.password,
    });
    const jwt = verifyJWTCookie(loginRes);
    const getRes = await request(app).get(route).set('cookie', jwt);
    expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('Should auth Employees access', async () => {
    const loginRes = await request(app).post(`${api}/users/login`).send({
      email: userEmployee.email,
      password: userEmployee.password,
    });
    const jwt = verifyJWTCookie(loginRes);
    await request(app).get(route).set('cookie', jwt);
    console.log(getRes.body);
    expect(200);
  });

  it('Should auth Managers access', async () => {
    const loginRes = await request(app).post(`${api}/users/login`).send({
      email: userManager.email,
      password: userManager.password,
    });
    const jwt = verifyJWTCookie(loginRes);
    await request(app).get(route).set('cookie', jwt);
    expect(200);
  });

  it('Should auth Admin access', async () => {
    const loginRes = await request(app).post(`${api}/users/login`).send({
      email: userAdmin.email,
      password: userAdmin.password,
    });
    const jwt = verifyJWTCookie(loginRes);
    await request(app).get(route).set('cookie', jwt);
    expect(200);
  });
});
