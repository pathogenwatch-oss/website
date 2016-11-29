const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  assemblies: [ { type: Schema.Types.ObjectId, ref: 'Assembly' } ],
  description: String,
  id: String,
  size: Number,
  speciesId: Number,
  status: String,
  statusReason: String,
  submission: {
    ended: Date,
    errors: Array,
    totalResultsExpected: Number,
    totalResultsReceived: Number,
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

module.exports = mongoose.model('Collection', schema);
