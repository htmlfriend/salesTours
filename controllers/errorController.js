const AppError = require('./../utils/appError');

// token errors
const handleWebTokenError = () =>
  new AppError('Invalid token, please log in again', 401);

const handleExpiredTokenError = () => {
  new AppError('Your token has expired, please log in again', 401);
};

// mongodb errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const { name } = err.keyValue;
  // console.log(value.match(/(["'])(?:(?=(\\?))\2.)*?\1/));
  const message = `Duplicate field value:${name}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  // console.log(value.match(/(["'])(?:(?=(\\?))\2.)*?\1/));
  const message = `Invalid input data.${errors.join('. ')}`;
  return new AppError(message, 400);
};

// diffrent error for prod and dev
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational , trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details

    // log error
    console.log('ERROR', err);

    //send generic messsage
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

// universal module

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleWebTokenError();
    if (err.name === 'TokenExpiredError') error = handleExpiredTokenError();
    sendErrorProd(error, res);
  }
};
