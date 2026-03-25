class APIFeatures {
  // query = query of mongoose (model Tour) / queryString = query of Express (req.query)

  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // 1B) Advanced filtering
    // Format for mongodb
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // 2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      // sort('price ratingAverage')
    } else {
      // Default sort for creating date
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // 3) Field Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // 4) Pagination
    if (this.queryString.page || this.queryString.limit) {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;

      // page=3&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3 ...
      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}

module.exports = APIFeatures;
