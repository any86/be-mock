const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: { type: String, isRequired: true },
  url: { type: String, isRequired: true },
  method: { type: String, isRequired: true },
  projectId: { type: Schema.ObjectId, isRequired: true },
  treeHeader: { type: Object, isRequired: true },
  treeRequest: { type: Object, isRequired: true },
  treeResponse: { type: Object, isRequired: true },
  mock: { type: Object, isRequired: true },
  createAt: { type: Date,  isRequired: true },
  updateAt: { type: Date, default: Date.now(), isRequired: true },
});

module.exports = mongoose.model('Doc', schema);