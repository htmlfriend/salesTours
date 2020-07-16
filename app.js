const morgan = require('morgan');
const express = require('express');

const app = express();

// routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
// middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// for parsing application/x-ww-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
