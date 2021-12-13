const mongoose = require('mongoose');

const { Schema } = mongoose;

const { addPreSaveHook } = require('./utils');

const schema = new Schema({
  admin: { type: Boolean, default: undefined },
  createdAt: Date,
  email: String,
  flags: Object,
  lastAccessedAt: Date,
  lastUpdatedAt: Date,
  limits: {
    maxCollectionSize: Object,
    maxDownloadSize: Number,
  },
  name: String,
  organisation: { type: Schema.Types.ObjectId, ref: 'Organisation' },
  priority: Number,
  photo: String,
  providerId: String,
  providerType: String,
});

schema.index(
  { _id: 1, priority: 1 },
  { partialFilterExpression: { priority: { $exists: true } } }
);

addPreSaveHook(schema);

schema.virtual('canRun').get(function () {
  const userFlags = this.flags || {};
  const experiments = Object.keys(userFlags).filter((_) => userFlags[_]);
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
