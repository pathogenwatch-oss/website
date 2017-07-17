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

module.exports = mongoose.model('Analysis', schema);
