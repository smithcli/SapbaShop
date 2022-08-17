/* eslint-disable object-shorthand */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const validator = require('validator');
const slugify = require('slugify');
const Store = require('./storeModel');
const AppError = require('../utils/appError');

const userSchema = new mongoose.Schema({
  store: {
    type: mongoose.Types.ObjectId,
    ref: 'Store',
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'employee', 'customer'],
    default: 'customer',
    required: [true, 'User role is required'],
  },
  name: {
    type: String,
    required: [true, 'User name is required'],
  },
  email: {
    type: String,
    required: [true, 'User email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  photo: String,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  password: {
    type: String,
    required: [true, 'A password is required'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password confirmation does not match',
    },
  },
  passwordChangedAt: {
    type: Date,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  slug: {
    type: String,
    unique: true,
  },
});

///  METHODS ///

// Check if password matches the user's hashed password.
userSchema.methods.checkPassword = async function (attemptPass, userPass) {
  // eslint-disable-next-line no-return-await
  return await bcrypt.compare(attemptPass, userPass);
};

// Check if password has changed since jwt timestamp.
userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const userPassChanged = this.passwordChangedAt.getTime() / 1000;
    return userPassChanged > jwtTimeStamp;
  }
  return false;
};

// Set reset token for forgot password
userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// Change password, remove resetToken and set date changed.
userSchema.methods.changePassword = function (pass, passConf) {
  this.password = pass;
  this.passwordConfirm = passConf;
  this.passwordResetToken = undefined;
  this.passwordResetExpires = undefined;
};

// Create slug - thai characters may not work
userSchema.methods.setSlug = function () {
  const randNum = Math.floor(Math.random() * 99999); // 5 random digits
  this.slug = slugify(`${this.name} ${randNum}`, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

///  MIDDLEWARE ///

userSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.setSlug();
  }
  next();
});

// Store id validator
userSchema.pre('save', async function (next) {
  if (!this.isModified('store') || !this.store) return next();
  if (!(await Store.findById(this.store))) {
    return next(new AppError(404, `${this.store} is not a valid store.`));
  }
  next();
});

// Store password as a hash, if password was modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Add passwordChangedAt for updated passwords
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; // 1sec to avoid conflicts with jwt
  next();
});

// Do not allow users with active = false to be queried, unless using adminFind
userSchema.pre(/^find/, function (next) {
  // comment is the only way I found to bypass the middleware when needed.
  if (this.getOptions().comment !== 'sapba-mgt') {
    this.find({ active: { $ne: false } });
  }
  next();
});

// Users do not have to be assigned to a store;
userSchema.pre('findOneAndUpdate', async function (next) {
  // Check for store in update body
  const userUpdate = this.getUpdate();
  if (!userUpdate.store) return next();
  // Verify it is a user that is being queried
  const user = await this.model.findOne(this.getQuery());
  if (!(user instanceof this.model)) return next();
  // Allow store to be null, if it is unset the property
  if (
    userUpdate.store === null
    || userUpdate.store === 'null'
    || userUpdate.store === ''
  ) {
    userUpdate.store = undefined;
    this.setUpdate(Object.assign(userUpdate, { $unset: { store: '' } }));
    // If not null, verify it is a valid store
  } else if (!(await Store.findById(userUpdate.store))) {
    return next(new AppError(404, `${userUpdate.store} is not a valid store.`));
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
