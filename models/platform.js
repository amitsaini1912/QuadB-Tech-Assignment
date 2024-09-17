const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  name: String,
  base_unit: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
});

module.exports = mongoose.model('Data', DataSchema);
