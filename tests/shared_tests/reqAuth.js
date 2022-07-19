const request = require('supertest');
const app = require('../../src/app');

exports.reqAuth = (reqType, route, obj = undefined) => {
  const reqToSend = () => {
    switch (reqType) {
      case 'get':
        return request(app).get(route).expect(401);
      case 'post':
        return request(app).post(route).send(obj).expect(401);
      case 'patch':
        return request(app).patch(route).send(obj).expect(401);
      case 'delete':
        return request(app).delete(route).expect(401);
      default:
        throw `${reqType} is not an option`;
    }
  };

  it('Should NOT allow un-authenticated users access', async () => {
    const res = await reqToSend();
    expect(res.body.message).toBe(
      'You are not logged in. Please log in to get access.'
    );
  });
};
