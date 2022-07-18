const AppError = require('../utils/appError');

// Error when using a bad _id
const castErrorHandler = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(400, message);
};

// Error when submiting invalid schema values
const validatorErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((item) => {
    return `${item.path}: ${item.message}`;
  });
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(400, message);
};

// Error when submitting the same value marked as unique by the schema
const duplicateFieldsHandler = (err) => {
  // User.email is currently the only unique value
  const value = err.keyValue.email;
  const message = `${value} already exists. Please use another value.`;
  return new AppError(400, message);
};

// TODO: Store association error during updateMe (BSONTypeError)

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // eslint-disable-next-line no-console
    console.error('Error', err);
    res.status(500).json({
      status: 'error',
      message: 'Somthing went very wrong!',
    });
  }
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') error = castErrorHandler(error);
    if (error.name === 'ValidationError') error = validatorErrorHandler(error);
    if (error.code === 11000) error = duplicateFieldsHandler(error);
    sendErrorProd(error, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
};
