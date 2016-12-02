const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  description: String,
  uuid: String,
  size: Number,
  speciesId: Number,
  status: { type: String, default: 'PENDING' },
  statusReason: String,
  submission: {
    ended: Date,
    errors: Array,
    totalResultsExpected: Number,
    totalResultsReceived: { type: Number, default: 0 },
    results: Object,
    started: { type: Date, default: Date.now },
  },
  subtrees: [
    { name: String,
      assemblies: [ { type: Schema.Types.ObjectId, ref: 'Assembly' } ],
      tree: String,
    },
  ],
  title: String,
  tree: String,
});

schema.methods.addUUID = function (uuid) {
  this.uuid = uuid;
  this.status = 'PROCESSING';
  return this.save();
};

schema.methods.failed = function (error) {
  this.status = 'FAILED';
  this.error = error;
  return this.save();
};

module.exports = mongoose.model('Collection', schema);
