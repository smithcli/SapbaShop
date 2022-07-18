const mongoose = require('mongoose');

exports.dbConnect = async (test) => {
  await mongoose.connect(process.env.MONGO_DATABASE_URL, {
    dbName: test,
  });
  await mongoose.connection.dropDatabase();
};

exports.dbDisconnect = async () => {
  await mongoose.disconnect();
};
