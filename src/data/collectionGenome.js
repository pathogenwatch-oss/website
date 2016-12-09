const mongoose = require('mongoose');
const { Schema } = mongoose;

const { setToObjectOptions } = require('./utils');

const schema = new Schema({
  _collection: { type: Schema.Types.ObjectId, ref: 'Collection' },
  fileId: { type: String, required: true },
  uuid: { type: String, required: true },
  name: { type: String, required: true },
  date: {
    year: Number,
    month: Number,
    day: Number,
  },
  position: {
    latitude: String,
    longitude: String,
  },
  country: String,
  pmid: String,
  userDefined: Object,
  metrics: Object,
  analysis: Array,
});

setToObjectOptions(schema);

schema.statics.addAnalysisResult = function (uuid, name, result) {
  return this.update({ uuid }, { $push: { analysis: { name, result } } });
};

module.exports = mongoose.model('CollectionGenome', schema);
