const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
require('dotenv').config({ path: './tests/config/test.env' });
const config = require('./config');

module.exports = async () => {
  if (config.Memory) {
    // Config to decided if an mongodb-memory-server instance should be used
    // it's needed in global space, because we don't want to create a new instance every test-suite
    const instance = await MongoMemoryServer.create();
    const uri = instance.getUri(config.Database);
    globalThis.__MONGOINSTANCE = instance;
    process.env.MONGO_DATABASE_URL = uri;
    console.log('\nUsing MongoMemoryServer');
  } else {
    process.env.MONGO_DATABASE_URL = `mongodb://${config.IP}:${config.Port}/${config.Database}`;
    console.log(`\nUsing DB at URL: ${process.env.MONGO_DATABASE_URL}`);
  }
  // Set API Version from config
  process.env.API_VERSION = config.ApiVersion;
  console.log(config);
  // The following is to make sure the database is clean before an test starts
  await mongoose.connect(process.env.MONGO_DATABASE_URL);
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
};
