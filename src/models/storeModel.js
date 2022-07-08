const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  bnum: {
    en: {
      type: String,
      required: [true, 'A store must have a building number / village in English'],
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
      required: [true, 'A store must have a subdistrict, district or city in English'],
      trim: true,
    },
    th: {
      type: String,
      required: [true, 'A store must have a subdistrict, district or city in Thai'],
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
  zip: {
    type: Number,
    required: [true, 'A store must have a zip code'],
    min: [5, 'zip codes are at least five numbers'],
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
  phone: {
    type: Number,
    required: [true, 'A store must have a phone number'],
  },
  coords: [Number],
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
