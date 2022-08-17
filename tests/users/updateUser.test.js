const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const User = require('../../src/models/userModel');
const auth = require('../shared_tests/authTests');

process.env.TEST_SUITE = 'test-updateUser';

const userOne = {
  role: 'manager',
  name: 'updateUser route',
  email: 'update_user@sapbashop.com',
};
let userUpdate;

beforeEach(async () => {
  // Reset userEmployee to original
  const { password, passwordConfirm, _id, ...user } = utm.userEmployee;
  await User.findByIdAndUpdate(_id, user);
  userUpdate = Object.assign({}, userOne);
});

describe(`PATCH /users/:id (test-updateUser)`, () => {
  const id = utm.userEmployee._id;
  const route = `${utm.api}/users/${id}`;
  const req = 'patch';

  auth.reqAuth(req, route, userUpdate);
  auth.noCustomerAuth(req, route, userUpdate);
  auth.noEmployeeAuth(req, route, userUpdate);
  auth.noManagerAuth(req, route, userUpdate);

  it('Should allow Admin to update user', async () => {
    const getRes = await request(app)
      .patch(route)
      .set('cookie', await utm.jwtAdmin())
      .send(userUpdate)
      .expect(200);
    expect(getRes.body.data.user.email).toBe(userUpdate.email);
    expect(getRes.body.data.user.role).toBe(userUpdate.role);
  });

  it('Should NOT allow user to be updated with existing email', async () => {
    userUpdate.email = utm.userCustomer.email; //has to be a different user
    const getRes = await request(app)
      .patch(route)
      .set('cookie', await utm.jwtAdmin())
      .send(userUpdate)
      .expect(400);
    expect(getRes.body).toHaveProperty(
      'message',
      `${utm.userCustomer.email} already exists. Please try again.`,
    );
  });

  it('Should NOT allow changes to passwords', async () => {
    userUpdate.password = 'pass5678';
    const getRes = await request(app)
      .patch(route)
      .set('cookie', await utm.jwtAdmin())
      .send(userUpdate)
      .expect(400);
    expect(getRes.body).toHaveProperty(
      'message',
      'This route is not for password updates.',
    );
  });

  it('Should NOT allow changes to id', async () => {
    userUpdate._id = utm.userCustomer._id;
    const getRes = await request(app)
      .patch(route)
      .set('cookie', await utm.jwtAdmin())
      .send(userUpdate)
      .expect(400);
    expect(getRes.body).toHaveProperty(
      'message',
      "Invalid input data. You cannot modify field '_id'.",
    );
  });
});
