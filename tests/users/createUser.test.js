const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const auth = require('../shared_tests/authTests');
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
  const req = 'post';

  auth.reqAuth(req, route, userTest);
  auth.noCustomerAuth(req, route, userTest);
  auth.noEmployeeAuth(req, route, userTest);
  auth.noManagerAuth(req, route, userTest);

  it('Should allow Admin to create user', async () => {
    const getRes = await request(app)
      .post(route)
      .set('cookie', await utm.jwtAdmin())
      .send(userTest)
      .expect(201);
    expect(getRes.body.data.user.email).toBe(userTest.email);
    expect(getRes.body.data.user.role).toBe(userTest.role);
  });

  it('Should NOT allow user to be created with existing email', async () => {
    const { _id, ...user } = utm.userEmployee;
    const getRes = await request(app)
      .post(route)
      .set('cookie', await utm.jwtAdmin())
      .send(user)
      .expect(400);
    expect(getRes.body).toHaveProperty(
      'message',
      `${utm.userEmployee.email} already exists. Please try again.`
    );
  });
});
