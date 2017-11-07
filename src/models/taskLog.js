const mongoose = require('mongoose');
const { Schema } = mongoose;

const { addPreSaveHook } = require('./utils');

const schema = new Schema({
  createdAt: Date,
  fileId: String,
  task: String,
  version: String,
  organismId: String,
  speciesId: String,
  genusId: String,
  duration: Number,
  exitCode: String,
});

addPreSaveHook(schema);

module.exports = mongoose.model('TaskLog', schema);
