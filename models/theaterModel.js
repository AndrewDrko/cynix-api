const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A theater must have a name'],
    unique: true,
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'A theater must have an address'],
    unique: true,
  },
  numScreens: {
    type: Number,
    required: [true, 'A theater must have numScreens'],
  },
});

const Theater = mongoose.model('Theater', theaterSchema);

module.exports = Theater;
