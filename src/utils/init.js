/* eslint-disable no-console */
const User = require('../models/userModel');

exports.addAdminUser = async () => {
  try {
    const users = await User.find();
    if (!users) {
      await User.create({
        role: 'admin',
        name: 'admin',
        email: 'admin@sapbashop.com',
        password: 'pass1234',
        passwordConfirm: 'pass1234',
      });
    }
  } catch (err) {
    console.log(err);
  }
};
