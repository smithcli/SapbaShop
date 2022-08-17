const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const stm = require('../shared_tests/storeTestModules');
const auth = require('../shared_tests/authTests');
const User = require('../../src/models/userModel');

process.env.TEST_SUITE = 'test-updateMe';

const userData = {
  // Allowed fields
  store: stm.storeOne._id,
  name: 'test user',
  email: 'test@email.com',
  photo: '/photo.jpg',
};

const checkUpdatedFields = (res, user) => {
  expect(res.body.data.user).toHaveProperty('_id', user._id);
  expect(res.body.data.user).toHaveProperty('store', userTest.store);
  expect(res.body.data.user).toHaveProperty('role', user.role);
  expect(res.body.data.user).toHaveProperty('name', userTest.name);
  expect(res.body.data.user).toHaveProperty('email', userTest.email);
  expect(res.body.data.user).toHaveProperty('photo', userTest.photo);
  expect(res.body.data.user).not.toHaveProperty('password');
  expect(res.body.data.user).not.toHaveProperty('passwordConfirm');
  expect(res.body.data.user).not.toHaveProperty('active');
  expect(res.body.data.user).not.toHaveProperty('passwordChangedAt');
};

let userTest;

beforeEach(async () => {
  userTest = Object.assign({}, userData);
  // Slow but easier to reset
  await User.collection.drop();
  await utm.addUsers();
});

describe(`PATCH /users/me (test-updateMe)`, () => {
  const route = `${utm.api}/users/me`;
  const req = 'patch';

  describe('Verify Access', () => {
    auth.reqAuth(req, route);

    it('Should auth Customers access', async () => {
      const getRes = await request(app)
        .patch(route)
        .set('cookie', await utm.jwtCustomer())
        .send(userTest)
        .expect(200);
      checkUpdatedFields(getRes, utm.userCustomer);
    });

    it('Should auth Employees access', async () => {
      const getRes = await request(app)
        .patch(route)
        .set('cookie', await utm.jwtEmployee())
        .send(userTest)
        .expect(200);
      checkUpdatedFields(getRes, utm.userEmployee);
    });

    it('Should auth Managers access', async () => {
      const getRes = await request(app)
        .patch(route)
        .set('cookie', await utm.jwtManager())
        .send(userTest)
        .expect(200);
      checkUpdatedFields(getRes, utm.userManager);
    });

    it('Should auth Admin access', async () => {
      const getRes = await request(app)
        .patch(route)
        .set('cookie', await utm.jwtAdmin())
        .send(userTest)
        .expect(200);
      checkUpdatedFields(getRes, utm.userAdmin);
    });
  });

  describe('Verify fields', () => {
    it.todo('Store verification, does not have validation for update');

    it('Does not allow password updates', async () => {
      userTest.password = 'pass12345';
      const getRes = await request(app)
        .patch(route)
        .set('cookie', await utm.jwtAdmin())
        .send(userTest)
        .expect(400);
      expect(getRes.body.message).toBe(
        'This route is not for password updates.',
      );
    });

    it('Does not allow changes to role', async () => {
      userTest.role = 'admin';
      const getRes = await request(app)
        .patch(route)
        .set('cookie', await utm.jwtCustomer())
        .send(userTest);
      //.expect(200);
      expect(getRes.body.data.user.role).toBe(utm.userCustomer.role);
    });
  });
});
