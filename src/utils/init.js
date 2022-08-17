/* eslint-disable no-console */
const User = require('../models/userModel');

exports.addAdminUser = async () => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      await User.create({
        role: 'admin',
        name: 'admin',
        email: 'admin@sapbashop.com',
        password: 'pass1234',
        passwordConfirm: 'pass1234',
      });
      console.log('Running first time initialization');
    }
  } catch (err) {
    console.log(err);
  }
};
