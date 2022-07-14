const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  store: {
    type: mongoose.Types.ObjectId,
    ref: 'store',
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'customer', 'employee'],
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Store password as a hash, if password was modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Check if password matches the user's hashed password.
userSchema.methods.checkPassword = async function (attemptPass, userPass) {
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

const User = mongoose.model('User', userSchema);

module.exports = User;
