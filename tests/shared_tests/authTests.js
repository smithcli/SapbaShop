const request = require('supertest');
const app = require('../../src/app');
const utm = require('./userTestModules');

const reqToSend = (req, route, obj = undefined) => {
  switch (req) {
    case 'get':
      return request(app).get(route);
    case 'post':
      return request(app).post(route).send(obj);
    case 'patch':
      return request(app).patch(route).send(obj);
    case 'delete':
      return request(app).delete(route);
    default:
      throw `${req} is not an option`;
  }
};

exports.reqAuth = (req, route, obj = undefined) => {
  it('Should NOT allow un-authenticated users access', async () => {
    const res = await reqToSend(req, route, obj).expect(401);
    expect(res.body.message).toBe(
      'You are not logged in. Please log in to get access.'
    );
  });
};

exports.noCustomerAuth = (req, route, obj = undefined) => {
  it('Should NOT allow auth Customers access', async () => {
    const getRes = await reqToSend(req, route, obj)
      .set('cookie', await utm.jwtCustomer())
      .expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });
};

exports.noEmployeeAuth = (req, route, obj = undefined) => {
  it('Should NOT allow Employees access', async () => {
    const getRes = await reqToSend(req, route, obj)
      .set('cookie', await utm.jwtEmployee())
      .expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });
};

exports.noManagerAuth = (req, route, obj = undefined) => {
  it('Should NOT allow Managers access', async () => {
    const getRes = await reqToSend(req, route, obj)
      .set('cookie', await utm.jwtManager())
      .expect(403);
    expect(getRes.body.message).toBe(
      'You do not have permission to perform this action.'
    );
  });
};
