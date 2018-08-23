const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  createdAt: Date,
  task: String,
  version: String,
  fileId: String,
  results: Object,
});

schema.index({ fileId: 1, task: 1, version: 1 });

// clustering index
schema.index({ task: 1, 'results.scheme': 1, 'results.st': 1 }, { partialFilterExpression: { task: 'cgmlst' } });

schema.statics.getResults = function (fileId, task, version, projection = {}) {
  return this.find({
    fileId: { $in: Array.isArray(fileId) ? fileId : [ fileId ] },
    task,
    version,
  }, Object.assign({ fileId: 1 }, projection))
  .lean();
};

module.exports = mongoose.model('Analysis', schema);
