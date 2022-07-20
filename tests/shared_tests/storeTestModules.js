const fs = require('fs');
const Store = require('../../src/models/storeModel');

const allStores = JSON.parse(
  fs.readFileSync(`${process.cwd()}/tests/data/stores.json`, 'utf8')
);

exports.addStores = async () => {
  await Store.create(allStores);
};

exports.storeOne = allStores[0];
exports.storeTwo = allStores[1];
exports.storeThree = allStores[2];
