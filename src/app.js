const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const storeRouter = require('./routes/storeRouter');
const userRouter = require('./routes/userRouter');
//const productRouter = require('./routes/productRouter')

const app = express();

// 1) Global Middlewares
// Development Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser, reading data from body into req.body
app.use(express.json());

// 2) Routes
app.use('/api/v1/stores', storeRouter);
app.use('/api/v1/users', userRouter);
//products, productRouter

// 3) Error Handling Middlewares
// Throw new error for any undefined routes
app.get('*', (req, res, next) => {
  next(new AppError(404, `${req.originalUrl} not found`));
});
app.use(globalErrorHandler);

module.exports = app;
