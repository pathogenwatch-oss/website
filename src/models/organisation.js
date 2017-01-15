const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  name: String,
  prefix: String,
  logo: String,
  url: String,
});

module.exports = mongoose.model('Organisation', schema);
