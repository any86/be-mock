const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: { type: String, isRequired: true },
  createAt: Date,
  updateAt: Date,
});


module.exports = mongoose.model('Project', ProjectSchema);