const request = require('supertest');
const app = require('../../src/app');
const utm = require('./userTestModules');
const { reqAuth } = require('../shared_tests/reqAuth');
const User = require('../../src/models/userModel');

process.env.TEST_SUITE = 'test-createUser';

const userOne = {
  role: 'employee',
  name: 'createUser route',
  email: 'create_user@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};
let userTest;

beforeEach(async () => {
  if (userTest) {
    const { email } = userTest;
    await User.findOneAndDelete({ email });
  }
  userTest = Object.assign({}, userOne);
});

describe(`POST /users (test-createUser)`, () => {
  const route = `${utm.api}/users`;

  reqAuth('post', route, userTest);

  it('Should NOT allow auth Customers access', async () => {
    const jwt = await utm.getJWT(utm.userCustomer);
    const getRes = await request(app)
      .post(route)
      .set('cookie', jwt)
      .send(userTest)
      .expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('Should NOT allow Employees access', async () => {
    const jwt = await utm.getJWT(utm.userEmployee);
    const getRes = await request(app)
      .post(route)
      .set('cookie', jwt)
      .send(userTest)
      .expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('Should NOT allow Managers access', async () => {
    const jwt = await utm.getJWT(utm.userManager);
    const getRes = await request(app)
      .post(route)
      .set('cookie', jwt)
      .send(userTest)
      .expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('Should allow Admin to create user', async () => {
    const jwt = await utm.getJWT(utm.userAdmin);
    const getRes = await request(app)
      .post(route)
      .set('cookie', jwt)
      .send(userTest)
      .expect(201);
    expect(getRes.body.data.user.email).toBe(userTest.email);
    expect(getRes.body.data.user.role).toBe(userTest.role);
  });

  it('Should NOT allow user to be created with existing email', async () => {
    const { _id, ...user } = utm.userEmployee;
    const jwt = await utm.getJWT(utm.userAdmin);
    const getRes = await request(app)
      .post(route)
      .set('cookie', jwt)
      .send(user)
      .expect(400);
    expect(getRes.body).toHaveProperty(
      'message',
      `${utm.userEmployee.email} already exists. Please use another value.`
    );
  });
});
