const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TreeSchema = new Schema({
  tree: { type: Object, isRequired: true },
  createAt: Date,
  updateAt: Date,
});

module.exports = mongoose.model('Tree', TreeSchema);