const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  _genome: { type: Schema.Types.ObjectId, ref: 'genome', index: true },
  collections: [ Schema.Types.ObjectId ],
});

module.exports = mongoose.model('Genomecollection', schema);
