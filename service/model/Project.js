const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: { type: String, isRequired: true },
  createAt: { type: Date,  isRequired: true },
  updateAt: { type: Date, default: Date.now(), isRequired: true },
});

module.exports = mongoose.model('Project', ProjectSchema);