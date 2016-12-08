const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  _fasta: { type: Schema.Types.ObjectId, ref: 'Fasta' },
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  date: {
    year: Number,
    month: Number,
    day: Number,
  },
  position: {
    latitude: String,
    longitude: String,
  },
  country: String,
  userDefined: Object,
});

module.exports = mongoose.model('assembly', schema);
