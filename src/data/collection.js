const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  assemblies: [ { type: Schema.Types.ObjectId, ref: 'Assembly' } ],
  description: String,
  id: String,
  speciesId: Number,
  status: String,
  submission: {
    ended: Date,
    errors: Array,
    expectedResults: Number,
    receivedResults: Number,
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
