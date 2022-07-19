const fs = require('fs');
const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const Store = require('../../src/models/storeModel');

const allStores = JSON.parse(
  fs.readFileSync(`${process.cwd()}/tests/data/stores.json`, 'utf8')
);
allStores.map((item) => {
  item._id = new mongoose.Types.ObjectId();
});

exports.addStores = async () => {
  await Store.create(allStores);
};

exports.storeOne = allStores[0];
exports.storeTwo = allStores[1];
exports.storeThree = allStores[2];
