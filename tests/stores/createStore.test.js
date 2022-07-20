const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const stm = require('../shared_tests/storeTestModules');
const auth = require('../shared_tests/authTests');
const Store = require('../../src/models/storeModel');

process.env.TEST_SUITE = 'test-createStore';

const storeModel = {
  bnum: {
    en: '481',
    th: '481',
  },
  street: {
    en: 'Mae Rim-Samoeng Old Road',
    th: 'ถ.แม่สาย-แม่ริม',
  },
  district: {
    en: 'Mae Rim',
    th: 'แม่ริม',
  },
  province: {
    en: 'Chiang Mai',
    th: 'เชียงใหม่',
  },
  country: {
    en: 'Thailand',
    th: 'ไทย',
  },
  zip: 50188,
  phone: 53896987,
  coords: [],
};

let storeTest;

beforeEach(async () => {
  if (storeTest) {
    const { phone } = storeTest;
    await Store.findOneAndDelete({ phone });
  }
  storeTest = Object.assign({}, storeModel);
});

describe(`POST /stores (test-createStore)`, () => {
  const route = `${utm.api}/stores`;
  const req = 'post';

  auth.reqAuth(req, route, storeTest);
  auth.noCustomerAuth(req, route, storeTest);
  auth.noEmployeeAuth(req, route, storeTest);
  auth.noManagerAuth(req, route, storeTest);

  it('Should allow Admin to create store', async () => {
    const getRes = await request(app)
      .post(route)
      .set('cookie', await utm.jwtAdmin())
      .send(storeTest)
      .expect(201);
    expect(getRes.body.data.store.street).toMatchObject(storeModel.street);
  });
});
