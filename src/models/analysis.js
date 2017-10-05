const mongoose = require('mongoose');
const { Schema } = mongoose;

const { addPreSaveHook } = require('./utils');

const schema = new Schema({
  createdAt: Date,
  task: String,
  version: String,
  fileId: String,
  results: Object,
});

// addPreSaveHook(schema);

schema.index({ task: 1, version: 1, fileId: 1 });

module.exports = mongoose.model('Analysis', schema);
