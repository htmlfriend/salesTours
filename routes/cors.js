// const cors = require('cors');

// const whitelist = ['http://localhost:3000', 'https://localhost:5000'];
// let corsOptonsDelegate = (req, callback) => {
//   let corsOptions;
//   console.log(req.header('Origin'));
//   if (whitelist.indexOf(req.header('Origin') !== -1)) {
//     corsOptions = { origin: true };
//   } else {
//     corsOptions = { origin: false };
//   }
//   callback(null, corsOptions);
// };

// exports.cors = cors();
// exports.module = corsOptonsDelegate;