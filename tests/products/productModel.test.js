const Product = require('../../src/models/productModel');
const ptm = require('../shared_tests/productTestModules');

process.env.TEST_SUITE = 'test-productModel';

beforeAll(async () => {
  await Product.findByIdAndDelete(ptm.groceryPro._id);
});

let productTest;
beforeEach(async () => {
  const { _id, ...product } = ptm.groceryPro;
  productTest = JSON.parse(JSON.stringify(product)); //deep copy needed
});


describe('Product Model Tests', () => {
  // Create a Product
  it('Should create a product', async () => {
    const product = await Product.create(productTest);
    expect(product).toBeInstanceOf(Product);
    ptm.checkProperties(product, productTest);
  });

  // Store - Req
  describe('Testing Store field', () => {
    it.failing('Should require a store', async () => {
      const { store, ...product } = productTest;
      await Product.create(product);
    });
    it('Required Error message should be', async () => {
      const { store, ...product } = productTest;
      await Product.create(product).catch((err) => {
        expect(err.message).toBe(
          'Product validation failed: store: A product must belong to a store.'
        );
      });
    });
    it.failing('Store should throw invalid id', async () => {
      productTest.store = '62d5da789de84f9f98a126';
      await Product.create(productTest);
    });
    it.failing('Should throw error if id does not match a store', async () => {
      productTest.store = '62d7e3a12d87f39787295a53'; // a user id
      await Product.create(productTest);
    });
    it('Invalid Store error message should be', async () => {
      productTest.store = '62d7e3a12d87f39787295a53'; // a user id
      await Product.create(productTest).catch((err) => {
        expect(err.message).toBe(
          '62d7e3a12d87f39787295a53 is not a valid store.'
        );
      });
    });
  });
  // Department - Req
  describe('Testing Department field', () => {
    const enValues = Product.schema.path('department.en').enumValues;
    const thValues = Product.schema.path('department.th').enumValues;
    it('Should match thai department if only given english', async () => {
      const { en, ...field } = productTest.department;
      productTest.department = field;
      const product = await Product.create(productTest);
      const enIndex = enValues.findIndex((i) => i === product.department.en);
      const thIndex = thValues.findIndex((i) => i === product.department.th);
      expect(enIndex).toBe(thIndex);
    })
    it('Should match english department if only given thai', async () => {
      const { th, ...field } = productTest.department;
      productTest.department = field;
      const product = await Product.create(productTest);
      const enIndex = enValues.findIndex((i) => i === product.department.en);
      const thIndex = thValues.findIndex((i) => i === product.department.th);
      expect(thIndex).toBe(enIndex);
    });
    it.failing('Department should be one of the enums in English', async () => {
      productTest.department.en = 'ร้านค้า';
      await Product.create(productTest);
    });
    it.failing('Department should one of the enums in Thai', async () => {
      productTest.department.th = 'grocery'; // Case sensitive
      await Product.create(productTest);
    });
  });

  // Name - Req
  describe('Testing Name field', () => {
    it.failing('Should require a name in English', async () => {
      const { en, ...field } = productTest.name;
      productTest.name = field;
      await Product.create(productTest);
    });
    it.failing('Should require a name in Thai', async () => {
      const { th, ...field } = productTest.name;
      productTest.name = field;
      await Product.create(productTest);
    });
  });

  // Description
  describe('Testing Description field', () => {
    it.todo('test for description');
  });

  // Price -Req
  describe('Testing Price field', () => {
    it.failing('Should require a Price', async () => {
      const { price, ...product } = productTest;
      await Product.create(product);
    });
  });

  // Unit - Req
  describe('Testing Unit field', () => {
    it('Should default to ea in English if not provided', async () => {
      const { en, ...field } = productTest.unit;
      productTest.unit = field;
      const product = await Product.create(productTest);
      expect(product.unit.en).toBe('ea');
    });
    it.failing('Should default to ชิ้น in Thai if not provdied', async () => {
      const { th, ...field } = productTest.unit;
      productTest.unit = field;
      const product = await Product.create(productTest);
      expect(product.unit.en).toBe('ชิ้น');
    });
  });

  // Size - Enum
  describe('Testing Size field', () => {
    it.failing('Size should be one of the enums', async () => {
      productTest.size = 'SM';
      await Product.create(productTest);
    });
  });

  // Count
  describe('Testing Count field', () => {
    it.todo('test for count');
  });

  // Images
  describe('Testing Images field', () => {
    it.todo('test for images');
  });

  // Tags
  describe('Testing Tags field', () => {
    it.todo('test for tags');
  });
});
