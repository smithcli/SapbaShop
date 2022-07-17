const cookieParser = require('cookie-parse');

exports.api = process.env.API_VERSION;

exports.verifyJWTCookie = (response) => {
  const cookie = cookieParser.parse(response.headers['set-cookie'][0]);
  expect(cookie).toHaveProperty('jwt');
  expect(cookie).toHaveProperty('HttpOnly', 'true');
  expect(cookie).toHaveProperty('Secure', 'true');
  const expectedExp = new Date();
  const expDate = process.env.JWT_EXPIRES_IN.substring(0, 2) * 1;
  expectedExp.setUTCDate(expectedExp.getUTCDate() + expDate);
  const actualExp = new Date(cookie.Expires).toLocaleDateString();
  expect(actualExp).toEqual(expectedExp.toLocaleDateString());
  return `jwt=${cookie.jwt}`;
};
