const mongoose = require('mongoose');

exports.dbConnect = async (test) => {
  await mongoose.connect(process.env.MONGO_DATABASE_URL, {
    dbName: test,
  });
};

exports.dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
};
