const mongoose = require('mongoose');
const { Schema } = mongoose;

const { addPreSaveHook } = require('./utils');

const schema = new Schema({
  fileId: { type: String, index: true },
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _organisation: { type: Schema.Types.ObjectId, ref: 'Organisation' },
  _session: String,
  createdAt: Date,
  lastAccessedAt: Date,
  lastUpdatedAt: Date,
});

addPreSaveHook(schema);

module.exports = mongoose.model('GenomeArchive', schema);
