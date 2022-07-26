const express = require('express');
const path = require('path');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const storeRouter = require('./routes/storeRouter');
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');
const viewRouter = require('./routes/viewRouter');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) Global Middlewares
// Development Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser, reading data from body into req.body
app.use(express.json());

// 2) Routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', viewRouter);
app.use('/api/v1/stores', storeRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);

// 3) Error Handling Middlewares
// Throw new error for any undefined routes
app.get('*', (req, res, next) => {
  next(new AppError(404, `${req.originalUrl} not found`));
});
app.use(globalErrorHandler);

module.exports = app;
