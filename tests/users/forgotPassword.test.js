const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const User = require('../../src/models/userModel');

process.env.TEST_SUITE = 'test-forgotPassword';

const verifyTokenCreated = async (id) => {
  const user = await User.findById(id).select(
    '+passwordResetToken +passwordResetExpires',
  );
  const { passwordResetToken, passwordResetExpires, ...leftover } = user;
  expect(passwordResetToken).toMatch(/^[a-f0-9]{64}$/gi); //sha256 hash
  const expectedExp = new Date();
  expectedExp.setMinutes(expectedExp.getMinutes() + 10);
  const actualExp = new Date(passwordResetExpires).toLocaleString();
  expect(actualExp).toEqual(expectedExp.toLocaleString());
};

describe(`POST /users/forgotPassword (test-forgotPassword)`, () => {
  const route = `${utm.api}/users/forgotPassword`;
  const validResponse =
    'If the account is a valid account, you will recieve a reset token in your email.';

  it('Should send email', async () => {
    const res = await request(app)
      .post(route)
      .send({ email: utm.userCustomer.email })
      .expect(200);
    expect(res.body.message).toBe(validResponse);
    await verifyTokenCreated(utm.userCustomer._id);
  });

  it('Should allow multiple attemps', async () => {
    const res = await request(app)
      .post(route)
      .send({ email: utm.userCustomer.email })
      .expect(200);
    await verifyTokenCreated(utm.userCustomer._id);
  });

  it('Production will not show if invalid email is sent', async () => {
    const res = await request(app)
      .post(route)
      .send({ email: 'notvalid@email.com' })
      .expect(200);
    expect(res.body.message).toBe(validResponse);
  });
});
