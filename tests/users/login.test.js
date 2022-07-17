const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/userModel');
const { api, verifyJWTCookie } = require('./userTestModules');
const mongoose = require('mongoose');

const userAdmin = {
  _id: new mongoose.Types.ObjectId(),
  role: 'admin',
  name: 'admin',
  email: 'loginadmin@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_DATABASE_URL);
  await User.deleteMany({});
  await User.create(userAdmin);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe(`POST /users/login Tests`, () => {
  const route = `${api}/users/login`;

  it('Should login an existing user', async () => {
    const res = await request(app).post(route).send({
      email: userAdmin.email,
      password: userAdmin.password,
    });
    expect(200);
    expect(res.body.data.user._id).toBe(userAdmin._id.toString());
    verifyJWTCookie(res);
  });

  it('Should return 401 for a non existing user', async () => {
    const res = await request(app).post(route).send({
      email: 'notHere@sapba.com',
      password: 'pass1234',
    });
    expect(401);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toBe('Incorrect email or password');
  });

  it('Should return 401 for a incorrect password', async () => {
    const res = await request(app).post(route).send({
      email: userAdmin.email,
      password: 'incorrectpass',
    });
    expect(401);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toBe('Incorrect email or password');
  });
});
