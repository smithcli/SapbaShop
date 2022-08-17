/* eslint-disable no-console */
/* eslint-disable no-process-exit */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const https = require('https');
const fs = require('fs');
const init = require('./utils/init');

// Load environment variables from .env file at root dir
dotenv.config();

// Default environment is production
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';

// Handles Synchronous that have not been caught
if (process.env.NODE_ENV === 'production') {
  process.on('uncaughtException', (err) => {
    console.error(
      'There was an uncaught error! Shutting down...\n',
      err.name,
      err.message,
    );
    process.exit(1);
  });
}

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
        err.message,
      );
      process.exit(1);
    } else {
      console.error(err);
    }
  });

// Process App with global middleware and start server
const app = require('./app');

// If Database is Empty, intialization is ran.
init.addAdminUser();

const port = process.env.PORT || 8000;
let server;

if (process.env.NODE_ENV === 'production') {
  if (process.env.SAPBA_HTTPS_KEY && process.env.SAPBA_HTTPS_CERT) {
    const key = fs.readFileSync(process.env.SAPBA_HTTPS_KEY);
    const cert = fs.readFileSync(process.env.SAPBA_HTTPS_CERT);
    server = https.createServer({ key, cert }, app).listen(port);
    console.log(`App running on port ${port}...`);
  } else {
    // For localhost only
    // TODO: Implement options for reverse proxy in http only
    server = app.listen(port, () => {
      console.log(`\n\u26a0 App is not yet built to run behind reverse proxy and will
  not work if used beyond localhost without HTTPS\n`);
      console.log(`App running HTTP ONLY on port ${port}...`);
    });
  }
} else {
  server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
  console.warn(
    `\n\u26a0 SERVER IS IN DEVELOPMENT MODE, SECURITY DEGRADED!
  If this was not intended please run the app with 'npm start'.\n`,
  );
}

// Handles all Async / Promises that have not been caught
if (process.env.NODE_ENV === 'production') {
  process.on('unhandledRejection', (err) => {
    console.error(
      'Unhandled Rejection! Shutting down...\n',
      err.name,
      err.message,
    );
    server.close(() => {
      process.exit(1);
    });
  });
}
