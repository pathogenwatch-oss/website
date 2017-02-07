const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  providerType: String,
  providerId: String,
  name: String,
  email: String,
  photo: String,
  organisation: { type: Schema.Types.ObjectId, ref: 'Organisation' },
});

module.exports = mongoose.model('User', schema);
