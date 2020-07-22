class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const shalowCopy = { ...this.queryString };
    // 1.Filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete shalowCopy[el]);
    // 2. Advanced query
    // {difficult: 'easy', duration :{ gte: 5}}
    let queryStr = JSON.stringify(shalowCopy);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // {difficult: 'easy',	duration: { $gte: '5' } }
    // gte, gt, lte,lt
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      // sort('-price -ratingAvrage')
    } else {
      // you see the newest posts
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    // field limiting = name,duration, difficulties
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // remove _v from response data
      this.query = this.query.select('-__v');
    }
    return this;
  }
  pagination() {
    // pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // page=2&limit=10 1-10, page 11-20
    this.query = this.query.skip(skip).limit(limit);
    //  if (this.queryString.page) {
    // 	 const numTours = await Tour.countDocuments();
    // 	 if (skip >= numTours) throw new Error('This page does not exist');
    //  }
    return this;
  }
}

module.exports = APIFeatures;
