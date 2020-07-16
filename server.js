const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });
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
    console.log('Connection successful');
  });

// schema

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must be a string'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'Must be a number'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const port = process.env.PORT || 5000;
// server
app.listen(port, () => {
  console.log(`I am running on ${port} ....`);
});
