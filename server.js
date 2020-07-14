const app = require('./app');
const port = 3000;

//server
app.listen(port, () => {
  console.log(`I am running on ${port} ....`);
});
