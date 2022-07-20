const Store = require('../../src/models/storeModel');
const { storeOne } = require('../shared_tests/storeTestModules');

process.env.TEST_SUITE = 'test-storeModel';

const storeModel = {
  bnum: {
    en: '87',
    th: '87',
  },
  street: {
    en: 'Sukhumvit Soi 11',
    th: 'สุขุมวิทซอย 11',
  },
  district: {
    en: 'Klongtoey-Nua, Sukhumvit',
    th: 'สุขุมวิท',
  },
  province: {
    en: 'Bangkok',
    th: 'กรุงเทพ',
  },
  country: {
    en: 'Thailand',
    th: 'ไทย',
  },
  zip: 10110,
  phone: 22891549,
  coords: [],
};

let storeTest;

beforeEach(async () => {
  if (storeTest) {
    const { phone } = storeTest;
    await Store.findOneAndDelete({ phone });
  }
  storeTest = Object.assign({}, storeModel);
});

const checkProperties = (store, testStore) => {
  expect(store).toHaveProperty('_id');
  expect(store.bnum).toMatchObject(testStore.bnum);
  expect(store.street).toMatchObject(testStore.street);
  expect(store.district).toMatchObject(testStore.district);
  expect(store.province).toMatchObject(testStore.province);
  expect(store.country).toMatchObject(testStore.country);
  expect(store.zip).toBe(testStore.zip);
  expect(store.phone).toBe(testStore.phone);
  expect(store).toHaveProperty('coords');
};

describe('Store Model Test', () => {
  // Create a store
  it('Should create a store with the required fields', async () => {
    const store = await Store.create(storeTest);
    expect(store).toBeInstanceOf(Store);
    checkProperties(store, storeTest);
  });

  // Bnum
  describe('Testing bnum field', () => {
    // en
    it.failing('Should require bnum properity in English', async () => {
      const { en, ...thBnum } = storeTest.bnum;
      storeTest.bnum = thBnum;
      await Store.create(storeTest);
    });
    it('Error message should be', async () => {
      const { en, ...thBnum } = storeTest.bnum;
      storeTest.bnum = thBnum;
      await Store.create(storeTest).catch((err) => {
        expect(err.message).toBe(
          'Store validation failed: bnum.en: A store must have a building number / village in English'
        );
      });
    });

    // th
    it.failing('Should require bnum properity in Thai', async () => {
      const { th, ...enBnum } = storeTest.bnum;
      storeTest.bnum = enBnum;
      await Store.create(storeTest);
    });
    it('Error message should be', async () => {
      const { th, ...enBnum } = storeTest.bnum;
      storeTest.bnum = enBnum;
      await Store.create(storeTest).catch((err) => {
        expect(err.message).toBe(
          'Store validation failed: bnum.th: A store must have a building number / village in Thai'
        );
      });
    });
  });

  // Street
  describe('Testing street field', () => {
    // en
    it.failing('Should require street properity in English', async () => {
      const { en, ...thStreet } = storeTest.street;
      storeTest.street = thStreet;
      await Store.create(storeTest);
    });
    it('Error message should be', async () => {
      const { en, ...thStreet } = storeTest.street;
      storeTest.street = thStreet;
      await Store.create(storeTest).catch((err) => {
        expect(err.message).toBe(
          'Store validation failed: street.en: A store must have a street address in English'
        );
      });
    });

    // th
    it.failing('Should require street properity in Thai', async () => {
      const { th, ...enStreet } = storeTest.street;
      storeTest.street = enStreet;
      await Store.create(storeTest);
    });
    it('Error message should be', async () => {
      const { th, ...enStreet } = storeTest.street;
      storeTest.street = enStreet;
      await Store.create(storeTest).catch((err) => {
        expect(err.message).toBe(
          'Store validation failed: street.th: A store must have a street address in Thai'
        );
      });
    });
  });

  // District
  describe('Testing district field', () => {
    // en
    it.failing('Should require district properity in English', async () => {
      const { en, ...thDistrict } = storeTest.district;
      storeTest.district = thDistrict;
      await Store.create(storeTest);
    });
    it('Error message should be', async () => {
      const { en, ...thDistrict } = storeTest.district;
      storeTest.district = thDistrict;
      await Store.create(storeTest).catch((err) => {
        expect(err.message).toBe(
          'Store validation failed: district.en: A store must have a subdistrict, district or city in English'
        );
      });
    });

    // th
    it.failing('Should require district properity in Thai', async () => {
      const { th, ...enDistrict } = storeTest.district;
      storeTest.district = enDistrict;
      await Store.create(storeTest);
    });
    it('Error message should be', async () => {
      const { th, ...enDistrict } = storeTest.district;
      storeTest.district = enDistrict;
      await Store.create(storeTest).catch((err) => {
        expect(err.message).toBe(
          'Store validation failed: district.th: A store must have a subdistrict, district or city in Thai'
        );
      });
    });
  });

  // Province
  describe('Testing province field', () => {
    // en
    it.failing('Should require province properity in English', async () => {
      const { en, ...thProvince } = storeTest.province;
      storeTest.province = thProvince;
      await Store.create(storeTest);
    });
    it('Error message should be', async () => {
      const { en, ...thProvince } = storeTest.province;
      storeTest.province = thProvince;
      await Store.create(storeTest).catch((err) => {
        expect(err.message).toBe(
          'Store validation failed: province.en: A store must have a province or state in English'
        );
      });
    });

    // th
    it.failing('Should require province properity in Thai', async () => {
      const { th, ...enProvince } = storeTest.province;
      storeTest.province = enProvince;
      await Store.create(storeTest);
    });
    it('Error message should be', async () => {
      const { th, ...enProvince } = storeTest.province;
      storeTest.province = enProvince;
      await Store.create(storeTest).catch((err) => {
        expect(err.message).toBe(
          'Store validation failed: province.th: A store must have a province or state in Thai'
        );
      });
    });
  });

  // Country
  describe('Testing country field', () => {
    // en
    it.failing('Should require country properity in English', async () => {
      const { en, ...thCountry } = storeTest.country;
      storeTest.country = thCountry;
      await Store.create(storeTest);
    });
    it('Error message should be', async () => {
      const { en, ...thCountry } = storeTest.country;
      storeTest.country = thCountry;
      await Store.create(storeTest).catch((err) => {
        expect(err.message).toBe(
          'Store validation failed: country.en: A store must have a country in English'
        );
      });
    });

    // th
    it.failing('Should require country properity in Thai', async () => {
      const { th, ...enCountry } = storeTest.country;
      storeTest.country = enCountry;
      await Store.create(storeTest);
    });
    it('Error message should be', async () => {
      const { th, ...enCountry } = storeTest.country;
      storeTest.country = enCountry;
      await Store.create(storeTest).catch((err) => {
        expect(err.message).toBe(
          'Store validation failed: country.th: A store must have a country in Thai'
        );
      });
    });
  });

  // Zip code
  describe('Testing zip code', () => {
    it.failing('Should require a zip code', async () => {
      const { zip, ...storeWithout } = storeTest;
      await Store.create(storeWithout);
    });
    it('Error message should be', async () => {
      const { zip, ...storeWithout } = storeTest;
      await Store.create(storeWithout).catch((err) => {
        expect(err.message).toBe(
          'Store validation failed: zip: A store must have a zip code'
        );
      });
    });

    //TODO: correct Zip code to require min 5
    it.skip.failing('Zip code should be min of 5 numbers', async () => {
      storeTest.zip = 25;
      await Store.create(storeTest);
    });
  });

  // Phone
  describe('Testing phone number', () => {
    it.failing('Should require a phone number', async () => {
      const { phone, ...storeWithout } = storeTest;
      await Store.create(storeWithout);
    });
    it('Error message should be', async () => {
      const { phone, ...storeWithout } = storeTest;
      await Store.create(storeWithout).catch((err) => {
        expect(err.message).toBe(
          'Store validation failed: phone: A store must have a phone number'
        );
      });
    });
  });
});
