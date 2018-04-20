const mongoose = require('mongoose');
const { Schema } = mongoose;

const { addPreSaveHook } = require('./utils');

const schema = new Schema({
  user: String,
  sessionID: String,
  scheme: String,
  result: Object,
  lastAccessedAt: Date,
  lastUpdatedAt: Date,
  createdAt: Date,
});

addPreSaveHook(schema);

schema.index({ user: 1, scheme: 1 });
schema.index({ sessionID: 1, scheme: 1 });

module.exports = mongoose.model('Clustering', schema);
