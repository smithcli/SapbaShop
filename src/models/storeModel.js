/* eslint-disable func-names */
const mongoose = require('mongoose');
const slugify = require('slugify');

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
    type: Number,
    required: [true, 'A store must have a zip code'],
    min: [5, 'zip codes are at least five numbers'],
  },
  phone: {
    type: Number,
    required: [true, 'A store must have a phone number'],
  },
  coords: [Number],
  slug: String,
});

/// MIDDLEWARE ///

// Create slug for english name, to keep international
storeSchema.pre('save', function (next) {
  this.slug = slugify(`${this.bnum.en}, ${this.street.en}`, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  });
  next();
});
// TODO: Validators for phone and zip, (min is not working) update only?
// TODO: post update for slug if fields change. All Models!!!.

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
