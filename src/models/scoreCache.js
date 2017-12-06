const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  fileId: String,
  version: String,
  scores: Object,
  differences: Object,
});

schema.index({ fileId: 1, version: 1 });

module.exports = mongoose.model('ScoreCache', schema);
