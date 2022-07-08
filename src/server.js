const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Handles Synchronous that have not been caught
if (process.env.NODE_ENV === 'production') {
  process.on('uncaughtException', (err) => {
    console.error(
      'There was an uncaught error! Shutting down...\n',
      err.name,
      err.message
    );
    process.exit(1);
  });
}

// Load environment variables from .env file at root dir
dotenv.config();
const db = process.env.MONGO_DATABASE_URL;
const dbUser = process.env.MONGO_DATABASE_USERNAME;
const dbPass = process.env.MONGO_DATABASE_PASSWORD;
let dbOptions;
if (dbUser !== undefined && dbPass !== undefined) {
  dbOptions = {
    user: dbUser,
    pass: dbPass,
  };
}

// Connect to MongoDB database
mongoose
  .connect(db, dbOptions)
  .then(() => {
    console.log('DB connection successful');
  })
  .catch((err) => {
    if (process.env.NODE_ENV === 'production') {
      console.error(
        'Unable to connect to MongoDB server! Shutting down...\n',
        err.name,
        err.message
      );
      process.exit(1);
    } else {
      console.error(err);
    }
  });

// Process App with global middleware and start server
const app = require('./app');
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handles all Async / Promises that have not been caught
if (process.env.NODE_ENV === 'production') {
  process.on('unhandledRejection', (err) => {
    console.error(
      'Unhandled Rejection! Shutting down...\n',
      err.name,
      err.message
    );
    server.close(() => {
      process.exit(1);
    });
  });
}
