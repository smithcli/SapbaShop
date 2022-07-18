const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config({ path: './tests/config/test.env' });
const config = require('./config');

module.exports = async () => {
  if (config.Memory) {
    // Config to decided if an mongodb-memory-server instance should be used
    // it's needed in global space, because we don't want to create a new instance every test-suite
    const instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    globalThis.__MONGOINSTANCE = instance;
    process.env.MONGO_DATABASE_URL = uri;
    console.log(`\nUsing MongoMemoryServer at ${uri}`);
  } else {
    process.env.MONGO_DATABASE_URL = `mongodb://${config.IP}:${config.Port}`;
    console.log(`\nUsing DB at URL: ${process.env.MONGO_DATABASE_URL}`);
  }
  // Set API Version from config
  process.env.API_VERSION = config.ApiVersion;
  console.log(config);
};
