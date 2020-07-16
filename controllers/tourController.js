const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

// check id in the middleware
exports.checkID = (req, res, next, value) => {
  console.log(`Tour id is :${value}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

// checkbody
// create a checkBody middleware
// check if body contains the name and price property
// if not , send back 400 (bad request)
// Add it to the post handler stack

exports.checkBody = (req, res, next) => {
  if (!req.body.name && !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name and price',
    });
  }
  next();
};

// routehandlers
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAdd: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getOneTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.patchTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: {
      tour: `Updated the tour...${tour}`,
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};
