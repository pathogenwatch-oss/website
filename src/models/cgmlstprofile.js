const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  fileId: { type: String, index: true },
  st: { type: String, maxLength: 40, minLength: 1 },
  matches: { type: Array },
  schemeSize: { type: Number, min: 1 },
});

schema.statics.upsertProfile = function (fileId, { results }) {
  const { st, schemeSize, code } = results;
  return this.findOneAndUpdate(
    { fileId },
    {
      fileId,
      st,
      schemeSize,
      matches: code.split('_'),
    },
    { upsert: true });
};

module.exports = mongoose.model('CgmlstProfile', schema);
