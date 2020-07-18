const Tour = require('./../models/tourModel');

// routehandlers
exports.getAllTours = async (req, res) => {
  try {
    // sort , page ,limit ,fields I can use later
    // I need to exclude them from queries to DB
    const shalowCopy = { ...req.query };
    // 1.Filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete shalowCopy[el]);
    // 2. Advanced query
    // {difficult: 'easy', duration :{ gte: 5}}
    let queryStr = JSON.stringify(shalowCopy);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // {difficult: 'easy',	duration: { $gte: '5' } }
    // gte, gt, lte,lt

    let query = Tour.find(JSON.parse(queryStr));
    // 3. Sorting sort=price
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(req.query.sort);
      // sort('-price -ratingAvrage')
    } else {
      // you see the newest posts
      query = query.sort('-createdAt');
    }

    // field limiting = name,duration, difficulties
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      // remove _v from response data
      query = query.select('-__v');
    }
    // 3. execute the query
    const tours = await query;
    // const tours =  Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // send response
    res.status(200).json({
      status: 'success',
      requestedAdd: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getOneTour = async (req, res) => {
  try {
    let tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.patchTour = async (req, res) => {
  try {
    let tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
