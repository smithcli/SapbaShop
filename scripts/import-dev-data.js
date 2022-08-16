// This script imports or deletes the test data for development
// To use this script run 'node import-dev-data --import'
// Or 'node import-dev-data --delete'
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../src/models/productModel');
const User = require('../src/models/userModel');
const Store = require('../src/models/storeModel');

const rootDir = process.cwd();
dotenv.config({ PATH: `${rootDir}/.env` });

const db = process.env.MONGO_DATABASE_URL;
mongoose.connect(db).then(() => {
  console.log('DB connection successful');
});

const allProducts = JSON.parse(
  fs.readFileSync(`${rootDir}/tests/data/products.json`, 'utf8'),
);
const allStores = JSON.parse(
  fs.readFileSync(`${rootDir}/tests/data/stores.json`, 'utf8'),
);
const allUsers = JSON.parse(
  fs.readFileSync(`${rootDir}/tests/data/users.json`, 'utf8'),
);

// Import data into db
const importData = async () => {
  try {
    await Store.create(allStores);
    await User.create(allUsers);
    await Product.create(allProducts);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data from collection
const deleteData = async () => {
  try {
    await Store.collection.drop();
    await User.collection.drop();
    await Product.collection.drop();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
