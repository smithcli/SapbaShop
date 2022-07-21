const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const User = require('../../src/models/userModel');
const { mock } = require('nodemailer');

process.env.TEST_SUITE = 'test-resetPassword';

const passModel = {
  password: 'pass5678',
  passwordConfirm: 'pass5678',
};

let passReset;
let route;
beforeEach(async () => {
  const forgot = `${utm.api}/users/forgotPassword`;
  await request(app)
    .post(forgot)
    .send({ email: utm.userCustomer.email })
    .expect(200);
  const { text, ...email } = mock.getSentMail()[0];
  const token = text.split('\n')[2].split('/')[7];
  passReset = Object.assign({}, passModel);
  route = `${utm.api}/users/resetPassword/${token}`;
});

afterEach(async () => {
  mock.reset();
});

describe(`PATCH /users/resetPassword (test-resetPassword)`, () => {
  it('Should reset password', async () => {
    const id = utm.userCustomer._id;
    const userBefore = await User.findById(id).select('+password');
    await request(app).patch(route).send(passReset).expect(200);
    const userAfter = await User.findById(id).select('+password');
    expect(userBefore.password).not.toBe(userAfter.password);
  });

  it('Should get jwt', async () => {
    const res = await request(app).patch(route).send(passReset).expect(200);
    utm.verifyJWTCookie(res);
  });

  it('Should not allow reset with bad token', async () => {
    const badRoute = `${utm.api}/users/resetPassword/07da770b6c9d3b2922c99a4bf95d167db57aaef26e2889aa4017a3d72a967526`;
    await request(app).patch(badRoute).send(passReset).expect(400);
  });

  it.todo('Should not allow reset after expiration');

  it('Should require pass and passConf', async () => {
    passReset.passwordConfirm = ''
    await request(app).patch(route).send(passReset).expect(400);
  });
});
