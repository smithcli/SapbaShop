const request = require('supertest');
const app = require('../../src/app');
const utm = require('../shared_tests/userTestModules');
const Product = require('../../src/models/productModel');
const auth = require('../shared_tests/authTests');
const ptm = require('../shared_tests/productTestModules');

process.env.TEST_SUITE = 'test-updateProduct';

const productTestModel = {
  name: {
    en: 'Test product en',
    th: 'Test product th',
  },
  description: {
    en: 'for testing purposes en',
    th: 'for testing purposes th',
  },
  department: {
    en: 'Grocery',
    th: 'ร้านค้า',
  },
  price: 555,
  unit: {
    en: 'ea',
    th: 'ชิ้น',
  },
  count: 1,
  store: '62d7448a42bc72ecc8a0726c',
};

let productTest;

beforeEach(async () => {
  // Reset housePro to original in db
  const { _id, ...product } = ptm.housePro;
  await Product.findByIdAndUpdate(_id, product);
  productTest = Object.assign({}, productTestModel);
});

describe(`PATCH /products/:id (test-updateProduct)`, () => {
  const id = ptm.housePro._id;
  const route = `${utm.api}/products/${id}`;
  const req = 'patch';

  auth.reqAuth(req, route, productTest);
  auth.noCustomerAuth(req, route, productTest);

  it('Should allow Employee to update product', async () => {
    const getRes = await request(app)
      .patch(route)
      .set('cookie', await utm.jwtEmployee())
      .send(productTest)
      .expect(200);
    expect(getRes.body.data.product).toMatchObject(productTest);
  });

  it('Should allow Manager to update product', async () => {
    const getRes = await request(app)
      .patch(route)
      .set('cookie', await utm.jwtManager())
      .send(productTest)
      .expect(200);
    expect(getRes.body.data.product).toMatchObject(productTest);
  });

  it('Should allow Admin to update product', async () => {
    const getRes = await request(app)
      .patch(route)
      .set('cookie', await utm.jwtAdmin())
      .send(productTest)
      .expect(200);
    expect(getRes.body.data.product).toMatchObject(productTest);
  });

  it('Should NOT allow changes to id', async () => {
    productTest._id = ptm.groceryPro._id;
    const getRes = await request(app)
      .patch(route)
      .set('cookie', await utm.jwtAdmin())
      .send(productTest)
      .expect(400);
    expect(getRes.body).toHaveProperty(
      'message',
      "Invalid input data. You cannot modify field '_id'.",
    );
  });

  describe('Validation Middleware should run', () => {
    const enValues = Product.schema.path('department.en').enumValues;
    const thValues = Product.schema.path('department.th').enumValues;

    it('Should match thai department if only given english', async () => {
      const { en, ...field } = productTest.department;
      productTest.department = field;
      const getRes = await request(app)
        .patch(route)
        .set('cookie', await utm.jwtAdmin())
        .send(productTest)
        .expect(200);
      const { product } = getRes.body.data;
      const enIndex = enValues.findIndex((i) => i === product.department.en);
      const thIndex = thValues.findIndex((i) => i === product.department.th);
      expect(enIndex).toBe(thIndex);
    });

    it('Should match english department if only given thai', async () => {
      const { th, ...field } = productTest.department;
      productTest.department = field;
      const getRes = await request(app)
        .patch(route)
        .set('cookie', await utm.jwtAdmin())
        .send(productTest)
        .expect(200);
      const { product } = getRes.body.data;
      const enIndex = enValues.findIndex((i) => i === product.department.en);
      const thIndex = thValues.findIndex((i) => i === product.department.th);
      expect(thIndex).toBe(enIndex);
    });

    it.todo('test for slug')
    it.todo('test for null size')
  });
});
