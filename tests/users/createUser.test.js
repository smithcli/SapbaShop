const request = require('supertest');
const app = require('../../src/app');
const utm = require('./userTestModules');

process.env.TEST_SUITE = 'test-createUser';

const userOne = {
  role: 'employee',
  name: 'createUser route',
  email: 'create_user@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};

describe(`POST /users (test-createUser)`, () => {
  const route = `${utm.api}/users`;

  it('Should NOT allow un-authenticated users access', async () => {
    const res = await request(app).post(route).send(userOne).expect(401);
    expect(res.body.message).toBe(
      'You are not logged in. Please log in to get access.'
    );
  });

  it('Should NOT allow auth Customers access', async () => {
    const jwt = await utm.getJWT(utm.userCustomer);
    const getRes = await request(app)
      .post(route)
      .set('cookie', jwt)
      .send(userOne)
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
      .send(userOne)
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
      .send(userOne)
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
      .send(userOne)
      .expect(201);
    expect(getRes.body.data.user.email).toBe(userOne.email);
    expect(getRes.body.data.user.role).toBe(userOne.role);
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
