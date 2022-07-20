const User = require('../../src/models/userModel');
const { storeTwo } = require('../shared_tests/storeTestModules');

process.env.TEST_SUITE = 'test-userModel';

const userModel = {
  role: 'employee',
  name: 'userModel',
  email: 'usermodel@sapbashop.com',
  password: 'pass1234',
  passwordConfirm: 'pass1234',
};
let userTest;

beforeEach(async () => {
  if (userTest) {
    const { email } = userTest;
    await User.findOneAndDelete({ email });
  }
  userTest = Object.assign({}, userModel);
});

const checkProperties = (user, testUser) => {
  expect(user).toHaveProperty('role', testUser.role);
  expect(user).toHaveProperty('name', testUser.name);
  expect(user).toHaveProperty('email', testUser.email);
};

describe('User Model Test', () => {
  it('Should create a user with the required fields', async () => {
    const user = await User.create(userTest);
    expect(user).toBeInstanceOf(User);
    checkProperties(user, userTest);
  });

  it('If role is not given it should default to customer', async () => {
    const { role, ...userNoRole } = userTest;
    const user = await User.create(userNoRole);
    expect(user.role).toBe('customer');
  });

  it('Role must be one of the Enums', async () => {
    userTest.role = 'idowhatiwant';
    await User.create(userTest).catch((err) => {
      expect(err.message).toBe(
        'User validation failed: role: `idowhatiwant` is not a valid enum value for path `role`.'
      );
    });
  });

  it('User requires a name', async () => {
    const { name, ...user } = userTest;
    await User.create(user).catch((err) => {
      expect(err.message).toBe(
        'User validation failed: name: User name is required'
      );
    });
  });

  it('User requires an email', async () => {
    const { email, ...user } = userTest;
    await User.create(user).catch((err) => {
      expect(err.message).toBe(
        'User validation failed: email: User email is required'
      );
    });
  });

  it('Email must be a valid email', async () => {
    userTest.email = 'notValidEmail';
    await User.create(userTest).catch((err) => {
      expect(err.message).toBe(
        'User validation failed: email: Please enter a valid email'
      );
    });
  });

  it('User requires a password', async () => {
    const { password, ...user } = userTest;
    await User.create(user).catch((err) => {
      expect(err.message).toContain(
        'User validation failed: password: A password is required'
      );
    });
  });

  it('User requires a password confirmation', async () => {
    const { passwordConfirm, ...user } = userTest;
    await User.create(user).catch((err) => {
      expect(err.message).toBe(
        'User validation failed: passwordConfirm: Please confirm your password'
      );
    });
  });

  it('User password confirmation must match password', async () => {
    userTest.passwordConfirm = 'pass0000';
    await User.create(userTest).catch((err) => {
      expect(err.message).toBe(
        'User validation failed: passwordConfirm: Password confirmation does not match'
      );
    });
  });

  it('A store can be assigned during User creation', async () => {
    userTest.store = storeTwo._id;
    const user = await User.create(userTest);
    checkProperties(user, userTest);
    expect(decodeURI(user.store)).toBe(storeTwo._id);
  });

  it('User store must be a valid id', async () => {
    userTest.store = '62d5da789de84f9f98a126';
    await User.create(userTest).catch((err) => {
      expect(err.message).toContain('Cast to ObjectId failed');
    });
  });

  it('A store ID must match a store', async () => {
    userTest.store = '62d5da789de84f9f98a126d7';
    await User.create(userTest).catch((err) => {
      expect(err.message).toBe(
        '62d5da789de84f9f98a126d7 is not a valid store.'
      );
    });
  });
});
