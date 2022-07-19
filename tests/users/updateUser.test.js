const request = require('supertest');
const app = require('../../src/app');
const utm = require('./userTestModules');
const User = require('../../src/models/userModel');

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

describe(`PATCH /users/:id (test-createUser)`, () => {
  const id = utm.userEmployee._id;
  const route = `${utm.api}/users/${id}`;

  it('Should NOT allow un-authenticated users access', async () => {
    const res = await request(app).patch(route).send(userUpdate).expect(401);
    expect(res.body.message).toBe(
      'You are not logged in. Please log in to get access.'
    );
  });

  it('Should NOT allow auth Customers access', async () => {
    const jwt = await utm.getJWT(utm.userCustomer);
    const getRes = await request(app)
      .patch(route)
      .set('cookie', jwt)
      .send(userUpdate)
      .expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('Should NOT allow Employees access', async () => {
    const jwt = await utm.getJWT(utm.userEmployee);
    const getRes = await request(app)
      .patch(route)
      .set('cookie', jwt)
      .send(userUpdate)
      .expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('Should NOT allow Managers access', async () => {
    const jwt = await utm.getJWT(utm.userManager);
    const getRes = await request(app)
      .patch(route)
      .set('cookie', jwt)
      .send(userUpdate)
      .expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('Should allow Admin to update user', async () => {
    const jwt = await utm.getJWT(utm.userAdmin);
    const getRes = await request(app)
      .patch(route)
      .set('cookie', jwt)
      .send(userUpdate)
      .expect(200);
    expect(getRes.body.data.user.email).toBe(userUpdate.email);
    expect(getRes.body.data.user.role).toBe(userUpdate.role);
  });

  it('Should NOT allow user to be updated with existing email', async () => {
    userUpdate.email = utm.userCustomer.email; //has to be a different user
    const jwt = await utm.getJWT(utm.userAdmin);
    const getRes = await request(app)
      .patch(route)
      .set('cookie', jwt)
      .send(userUpdate)
      .expect(400);
    expect(getRes.body).toHaveProperty(
      'message',
      `${utm.userCustomer.email} already exists. Please use another value.`
    );
  });

  it('Should NOT allow changes to passwords', async () => {
    userUpdate.password = 'pass5678';
    const jwt = await utm.getJWT(utm.userAdmin);
    const getRes = await request(app)
      .patch(route)
      .set('cookie', jwt)
      .send(userUpdate)
      .expect(400);
    expect(getRes.body).toHaveProperty(
      'message',
      'This route is not for password updates.'
    );
  });

  it('Should NOT allow changes to id', async () => {
    userUpdate._id = utm.userCustomer._id;
    const jwt = await utm.getJWT(utm.userAdmin);
    const getRes = await request(app)
      .patch(route)
      .set('cookie', jwt)
      .send(userUpdate)
      .expect(400);
    expect(getRes.body).toHaveProperty(
      'message',
      "Invalid input data. You cannot modify field '_id'."
    );
  });
});
