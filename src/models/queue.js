const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  type: String,
  message: {
    spec: Object,
    metadata: Object,
  },
  rejectionReason: String,
});

module.exports = mongoose.model('Queue', schema, '_queue');
