const mongoose = require('mongoose');
const { Schema } = mongoose;

const { addPreSaveHook } = require('./utils');

const schema = new Schema({
  user: String,
  scheme: String,
  pi: Array,
  lambda: Array,
  STs: Array,
  threshold: Number,
  edges: Object,
  lastAccessedAt: Date,
  lastUpdatedAt: Date,
  createdAt: Date,
  public: { type: Boolean, default: false },
  version: String,
});

addPreSaveHook(schema);

schema.index({ user: 1, scheme: 1 });
schema.index({ public: 1, scheme: 1 });

module.exports = mongoose.model('Clustering', schema);
