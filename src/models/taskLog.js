const mongoose = require('mongoose');
const { Schema } = mongoose;

const { addPreSaveHook } = require('./utils');

const schema = new Schema({
  createdAt: Date,
  task: String,
  version: String,
  duration: Number,
  exitCode: String,

  fileId: String,
  organismId: String,
  speciesId: String,
  genusId: String,
  user: String,
  sessionID: String,
  scheme: String,
});

addPreSaveHook(schema);

module.exports = mongoose.model('TaskLog', schema);
