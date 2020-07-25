const dotenv = require('dotenv');
const mongoose = require('mongoose');

// uncall exceptions
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! SHUTTING DOWN ...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    // .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('Connection successful', process.env.NODE_ENV);
  });

const port = process.env.PORT || 5000;
// server
const server = app.listen(port, () => {
  console.log(`I am running on ${port} ....`);
});

// subsribe to the event unhandlerRejection
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION! SHUTTING DOWN ...');
  server.close(() => {
    process.exit(1);
  });
});
