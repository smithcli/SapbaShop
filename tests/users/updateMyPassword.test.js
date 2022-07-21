const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const auth = require('../shared_tests/authTests');
const User = require('../../src/models/userModel');

process.env.TEST_SUITE = 'test-updateMyPassword';

const passModel = {
  passwordCurrent: 'pass1234',
  password: 'pass5678',
  passwordConfirm: 'pass5678',
};

let passUpdate;
beforeEach(async () => {
  passUpdate = Object.assign({}, passModel);
});

const getPassword = async (id) => {
  const user = await User.findById(id).select('+password');
  return user.password;
};

describe(`PATCH /users/updateMyPassword (test-updateMyPassword)`, () => {
  const route = `${utm.api}/users/updateMyPassword`;
  const req = 'patch';

  auth.reqAuth(req, route);

  it('Should update user password', async () => {
    const res = await request(app)
      .patch(route)
      .set('cookie', await utm.jwtCustomer())
      .send(passUpdate)
      .expect(200);
  });

  // using different user instead of reseting
  it('Should throw error when current password does not match', async () => {
    passUpdate.passwordCurrent = 'notthepass';
    const res = await request(app)
      .patch(route)
      .set('cookie', await utm.jwtEmployee())
      .send(passUpdate)
      .expect(401);
    expect(res.body.message).toBe('Current password is incorrect.')
  });

  it('Verify password hash changes', async () => {
    const before = await getPassword(utm.userEmployee._id);
    const res = await request(app)
      .patch(route)
      .set('cookie', await utm.jwtEmployee())
      .send(passUpdate)
      .expect(200);
    const after = await getPassword(utm.userEmployee._id);
    expect(before).not.toBe(after);
  });
});
