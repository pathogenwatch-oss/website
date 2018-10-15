const mongoose = require('mongoose');
const { Schema } = mongoose;

const { addPreSaveHook } = require('./utils');

const schema = new Schema({
  createdAt: Date,
  email: String,
  lastAccessedAt: Date,
  lastUpdatedAt: Date,
  name: String,
  organisation: { type: Schema.Types.ObjectId, ref: 'Organisation' },
  photo: String,
  providerType: String,
  providerId: String,
  admin: { type: Boolean, default: undefined },
  flags: Object,
});

addPreSaveHook(schema);

schema.virtual('showKlebExperiment').get(function () {
  return this.flags && this.flags.KLEB_EXPERIMENT_USER;
});

module.exports = mongoose.model('User', schema);
module.exports.KLEB_EXPERIMENT_TAXIDS = [ '1463165', '2026240', '244366', '28901', '498019', '562', '570', '573', '590' ];
