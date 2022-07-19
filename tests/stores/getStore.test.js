const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const { storeOne, ...stm } = require('../shared_tests/storeTestModules');

process.env.TEST_SUITE = 'test-getStore';

describe(`GET /stores/:id (test-getStore)`, () => {
  const id = storeOne._id;
  const route = `${utm.api}/stores/${id}`;

  it('Should allow anonymous access', async () => {
    const res = await request(app).get(route).expect(200);
    expect(res.body.data.store).toMatchObject(storeOne);
  });

  it('Should auth Customers access', async () => {
    const res = await request(app)
      .get(route)
      .set('cookie', await utm.jwtCustomer())
      .expect(200);
    expect(res.body.data.store).toMatchObject(storeOne);
  });

  it('Should auth Employees access', async () => {
    const res = await request(app)
      .get(route)
      .set('cookie', await utm.jwtEmployee())
      .expect(200);
    expect(res.body.data.store).toMatchObject(storeOne);
  });

  it('Should auth Managers access', async () => {
    const res = await request(app)
      .get(route)
      .set('cookie', await utm.jwtManager())
      .expect(200);
    expect(res.body.data.store).toMatchObject(storeOne);
  });

  it('Should auth Admin access', async () => {
    const res = await request(app)
      .get(route)
      .set('cookie', await utm.jwtAdmin())
      .expect(200);
    expect(res.body.data.store).toMatchObject(storeOne);
  });
});
