const mongoose = require('mongoose');
const { Schema } = mongoose;

const { addPreSaveHook } = require('./utils');

const schema = new Schema({
  createdAt: Date,
  lastAccessedAt: Date,
  lastUpdatedAt: Date,
  logo: String,
  name: String,
  prefix: String,
  url: String,
});

addPreSaveHook(schema);

module.exports = mongoose.model('Organisation', schema);
