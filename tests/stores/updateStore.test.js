const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const stm = require('../shared_tests/storeTestModules');
const Store = require('../../src/models/userModel');
const auth = require('../shared_tests/authTests');

process.env.TEST_SUITE = 'test-updateStore';

const storeModel = {
  bnum: {
    en: '87',
    th: '87',
  },
  street: {
    en: 'Sukhumvit Soi 11',
    th: 'สุขุมวิทซอย 11',
  },
  district: {
    en: 'Klongtoey-Nua, Sukhumvit',
    th: 'สุขุมวิท',
  },
  province: {
    en: 'Bangkok',
    th: 'กรุงเทพ',
  },
  country: {
    en: 'Thailand',
    th: 'ไทย',
  },
  zip: 10110,
  phone: 22891549,
  coords: [],
};

let storeTest;

beforeEach(async () => {
  // Reset storeThree to original in db
  const { _id, ...store } = stm.storeThree;
  await Store.findByIdAndUpdate(_id, store);
  storeTest = Object.assign({}, storeModel);
});

describe(`PATCH /stores/:id (test-updateStore)`, () => {
  const id = stm.storeThree._id;
  const route = `${utm.api}/stores/${id}`;
  const req = 'patch';

  auth.reqAuth(req, route, storeTest);
  auth.noCustomerAuth(req, route, storeTest);
  auth.noEmployeeAuth(req, route, storeTest);

  it('Should allow Manager to update store', async () => {
    const getRes = await request(app)
      .patch(route)
      .set('cookie', await utm.jwtManager())
      .send(storeTest)
      .expect(200);
    expect(getRes.body.data.store.street).toMatchObject(storeModel.street);
  });

  it('Should allow Admin to update store', async () => {
    const getRes = await request(app)
      .patch(route)
      .set('cookie', await utm.jwtAdmin())
      .send(storeTest)
      .expect(200);
    expect(getRes.body.data.store.street).toMatchObject(storeModel.street);
  });

  it('Should NOT allow changes to id', async () => {
    storeTest._id = stm.storeOne._id;
    const getRes = await request(app)
      .patch(route)
      .set('cookie', await utm.jwtAdmin())
      .send(storeTest)
      .expect(400);
    expect(getRes.body).toHaveProperty(
      'message',
      "Invalid input data. You cannot modify field '_id'."
    );
  });
});
