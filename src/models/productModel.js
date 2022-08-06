/* eslint-disable func-names */
const mongoose = require('mongoose');
const slugify = require('slugify');
const Store = require('./storeModel');
const AppError = require('../utils/appError');

const productSchema = new mongoose.Schema({
  store: {
    type: mongoose.Types.ObjectId,
    ref: 'Store',
    required: [true, 'A product must belong to a store.'],
  },
  department: {
    en: {
      type: String,
      required: [true, 'A product must belong to a department in English.'],
      enum: {
        values: [
          'Grocery',
          'Clothing and Accessories',
          'Beauty and Personal Care',
          'Health and Wellness',
          'Household',
        ],
        message: '{VALUE} is not a valid department',
      },
    },
    th: {
      type: String,
      required: [true, 'A product must belong to a department in Thai.'],
      enum: {
        values: [
          'ร้านค้า',
          'เสื้อผ้าและเครื่องประดับ',
          'เครื่องสำอางค์และของใช้ส่วนตัว',
          'สินค้าเพื่อสุขภาพ',
          'อุปกรณ์และของใช้ในครัวเรือน',
        ],
        message: '{VALUE} is not a valid department',
      },
    },
  },
  name: {
    en: {
      type: String,
      required: [true, 'A product name is required in English.'],
      trim: true,
    },
    th: {
      type: String,
      required: [true, 'A product name is required in Thai.'],
      trim: true,
    },
  },
  description: {
    en: {
      type: String,
      trim: true,
    },
    th: {
      type: String,
      trim: true,
    },
  },
  price: {
    type: Number,
    required: [true, 'A product requires a price (THB).'],
  },
  unit: {
    en: {
      type: String,
      default: 'ea',
      required: [true, 'A product requires a unit of measure in English.'],
      trim: true,
    },
    th: {
      type: String,
      default: 'ชิ้น',
      required: [true, 'A product requires a unit of measure in Thai.'],
      trim: true,
    },
  },
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL'],
  },
  count: Number,
  images: [String],
  slug: String,
});

/// METHODS ///

productSchema.methods.setSlug = function () {
  this.slug = slugify(this.name.en, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

// allows user to remove size enum value if desired
productSchema.methods.allowNullSize = function () {
  if (this.size === null || this.size === 'null') {
    this.size = undefined;
  }
};

// Match lang department if one is not given;
productSchema.methods.matchDepartment = function () {
  if (this.department.en && !this.department.th) {
    const values = productSchema.path('department.en').enumValues;
    const index = values.findIndex((i) => i === this.department.en);
    this.department.th = productSchema.path('department.th').enumValues[index];
  } else if (this.department.th && !this.department.en) {
    const values = productSchema.path('department.th').enumValues;
    const index = values.findIndex((i) => i === this.department.th);
    this.department.en = productSchema.path('department.en').enumValues[index];
  }
};

/// MIDDLEWARE ///

// pre validate hooks
productSchema.pre('validate', function (next) {
  this.matchDepartment();
  this.allowNullSize();
  next();
});

// Create slug for english name, to keep international
productSchema.pre('save', function (next) {
  if (this.isModified('name.en')) this.setSlug();
  next();
});

productSchema.pre('save', async function (next) {
  if (!this.isModified('store') || !this.store) return next();
  if (!(await Store.findById(this.store))) {
    return next(new AppError(404, `${this.store} is not a valid store.`));
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
