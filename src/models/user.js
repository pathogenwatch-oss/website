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

schema.virtual('showEsblCpeExperiment').get(function () {
  return !!(this.flags && this.flags.ESBL_CPE_EXPERIMENT_USER);
});

schema.virtual('canRun').get(function () {
  const userFlags = this.flags || {};
  const experiments = Object.keys(userFlags).filter(_ => userFlags[_]);
  return (task) => {
    const { flags = {} } = task;
    if (Object.keys(flags).length === 0) return true;
    for (const flag of Object.keys(flags)) {
      if (experiments.includes(flag)) return true;
    }
    return false;
  };
});

module.exports = mongoose.model('User', schema);
