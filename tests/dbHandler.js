const mongoose = require('mongoose');
const { addUsers } = require('./shared_tests/userTestModules');
const { addStores } = require('./shared_tests/storeTestModules');

beforeAll(async () => {
  checkForTEST_SUITE();
  await mongoose.connect(process.env.MONGO_DATABASE_URL, {
    dbName: process.env.TEST_SUITE,
  });
  await addUsers();
  await addStores();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

const checkForTEST_SUITE = () => {
  if (!process.env.TEST_SUITE) {
    process.env.TEST_SUITE = process.env.JEST_WORKER_ID;
    console.log(
      "Please add to test: process.env.TEST_SUITE = 'test-<endpoint>'"
    );
  }
};
