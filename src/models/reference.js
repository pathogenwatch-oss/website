const mongoose = require('mongoose');
const { Schema } = mongoose;

const { addPreSaveHook } = require('./utils');

const schema = new Schema({
  createdAt: Date,
  lastAccessedAt: Date,
  lastUpdatedAt: Date,
  newick: String,
  labels: Object,
  organismId: String,
});

addPreSaveHook(schema);

schema.statics.getLatest = function (organismId) {
  return (
    this
      .find({ organismId })
      .sort({ createdAt: -1 })
      .limit(1)
      .then(([ doc ]) => doc)
  );
};

module.exports = mongoose.model('Reference', schema);
