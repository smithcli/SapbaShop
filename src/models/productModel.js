const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  store: {
    type: mongoose.Types.ObjectId,
    ref: 'store',
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
        message: `A product must belong to one of these departments ${values}`,
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
        message: `A product must belong to one of these departments ${values}`,
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
      required: [true, 'A product description is required in English.'],
      trim: true,
    },
    th: {
      type: String,
      required: [true, 'A product description is required in Thai.'],
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
      default: 'EA',
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
  count: Number,
  images: [String],
  tags: {
    en: { type: [String], trim: true },
    th: { type: [String], trim: true },
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
