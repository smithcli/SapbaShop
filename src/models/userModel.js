const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  store: {
    type: ObjectId,
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

const User = mongoose.model('User', userSchema);

module.exports = User;
