const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  st: String,
  version: String,
  scheme: String,
  scores: Object,
});

schema.index({ st: 1, version: 1 });

module.exports = mongoose.model('ClusteringCache', schema);
