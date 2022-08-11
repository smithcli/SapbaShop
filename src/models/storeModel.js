/* eslint-disable func-names */
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const storeSchema = new mongoose.Schema({
  bnum: {
    en: {
      type: String,
      required: [
        true,
        'A store must have a building number / village in English',
      ],
      trim: true,
    },
    th: {
      type: String,
      required: [true, 'A store must have a building number / village in Thai'],
      trim: true,
    },
  },
  street: {
    en: {
      type: String,
      required: [true, 'A store must have a street address in English'],
      trim: true,
    },
    th: {
      type: String,
      required: [true, 'A store must have a street address in Thai'],
      trim: true,
    },
  },
  district: {
    en: {
      type: String,
      required: [
        true,
        'A store must have a subdistrict, district or city in English',
      ],
      trim: true,
    },
    th: {
      type: String,
      required: [
        true,
        'A store must have a subdistrict, district or city in Thai',
      ],
      trim: true,
    },
  },
  province: {
    en: {
      type: String,
      required: [true, 'A store must have a province or state in English'],
      trim: true,
    },
    th: {
      type: String,
      required: [true, 'A store must have a province or state in Thai'],
      trim: true,
    },
  },
  country: {
    en: {
      type: String,
      required: [true, 'A store must have a country in English'],
      trim: true,
    },
    th: {
      type: String,
      required: [true, 'A store must have a country in Thai'],
      trim: true,
    },
  },
  zip: {
    type: String,
    required: [true, 'A store must have a zip code'],
    validate: {
      validator: (zipCode) => validator.isPostalCode(zipCode, 'any'),
      message: 'Please enter a valid zip code',
    },
  },
  phone: {
    type: String,
    required: [true, 'A store must have a phone number'],
    match: [
      /((0)(\d{1,2}-?\d{3}-?\d{3,4}))/g,
      'Please enter a valid phone number',
    ],
  },
  coords: [Number],
  slug: String,
});
/// METHODS ///

// Remove dashes to keep uniform
storeSchema.methods.trimPhone = function () {
  this.phone = this.phone.split('-').join('');
};

// Create slug for english name, to keep international
storeSchema.methods.setSlug = function () {
  this.slug = slugify(`${this.bnum.en} ${this.street.en}`, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

/// MIDDLEWARE ///

storeSchema.pre('validate', function (next) {
  if (this.isModified('bnum.en') || this.isModified('street.en')) {
    this.setSlug();
  }
  this.trimPhone();
  next();
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
