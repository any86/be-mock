const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MockSchema = new Schema({
  mock: { type: Object, isRequired: true },
  docId: { type: Schema.ObjectId, isRequired: true },
  params: Object,
  body:Object,
  httpCode: { type: Number, default: 200 },
  // paramsHash:{type:String, isRequired: true },
  createAt: Date,
  updateAt: Date,
});

module.exports = mongoose.model('Mock', MockSchema);