const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const storeRouter = require('./routes/storeRouter');
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');
const viewRouter = require('./routes/viewRouter');

const app = express();

// ORDER MATTERS!
/// 1) Global Middlewares ///

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Development Logging Middleware
  app.use(cors({ origin: true, credentials: true })); // for use with dev proxy
}

// Pug page rendering engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Body Parser, reading data from body into req.body
app.use(express.json());

// Static pages and supporting elements
app.use(express.static(path.join(__dirname, 'public')));

/// 2) Routes ///

// RESTapi
app.use('/api/v1/stores', storeRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);

// Server Side rendered pages
app.use('/', viewRouter);

/// 3) Error Handling Middlewares ///

// Throw new error for any undefined routes
app.get('*', (req, res, next) => {
  next(new AppError(404, `${req.originalUrl} not found`));
});
app.use(globalErrorHandler);

module.exports = app;
