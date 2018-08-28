const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  fileId: String,
  versions: {
    tree: String,
    core: String,
  },
  scores: Object,
  differences: Object,
});

schema.index({ fileId: 1, 'versions.core': 1, 'versions.tree': 1 });

module.exports = mongoose.model('ScoreCache', schema);
