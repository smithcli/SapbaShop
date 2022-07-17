const { MongoMemoryServer } = require('mongodb-memory-server');
const config = require('./config');

module.exports = async () => {
  if (config.Memory) {
    // Config to decided if an mongodb-memory-server instance should be used
    await __MONGOINSTANCE.stop();
  }
};
