const mongoose = require('mongoose');
const { Schema } = mongoose;

const { addPreSaveHook } = require('./utils');

const schema = new Schema({
  // metadata
  createdAt: Date,
  task: String,
  version: String,
  duration: Number,
  exitCode: String,

  // ids
  fileId: String,
  organismId: String,
  speciesId: String,
  genusId: String,
  collectionId: String,

  // clustering
  user: String,
  sessionID: String,
  scheme: String,
});

addPreSaveHook(schema);

module.exports = mongoose.model('TaskLog', schema);
