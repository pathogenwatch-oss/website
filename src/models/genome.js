const mongoose = require('mongoose');
const { Schema } = mongoose;

const geocoding = require('geocoding');

const { setToObjectOptions, addPreSaveHook, getSummary } = require('./utils');

const schema = new Schema({
  _file: { type: Schema.Types.ObjectId, ref: 'GenomeFile' },
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, index: 'text' },
  speciesId: String,
  year: Number,
  month: Number,
  day: Number,
  date: Date,
  latitude: Number,
  longitude: Number,
  country: String,
  pmid: String,
  userDefined: Object,
  public: { type: Boolean, default: false },
  reference: { type: Boolean, default: false },
  binned: { type: Boolean, default: false },
  uploadedAt: Date,
  createdAt: Date,
  lastAccessedAt: Date,
  lastUpdatedAt: Date,
});

setToObjectOptions(schema, (_, genome, { user = {} }) => {
  const { _user } = genome;
  const { id } = user;
  genome.owner = (_user && id && _user.toString() === id) ? 'me' : 'other';
  genome.speciesName = genome._file.speciesName;
  genome.metrics = genome._file.metrics;
  delete genome._file;
  delete genome._user;
  return genome;
});

addPreSaveHook(schema);

function getCountryCode(latitude, longitude) {
  if (latitude && longitude) {
    return geocoding.getCountryCode(
      Number.parseFloat(latitude),
      Number.parseFloat(longitude)
    );
  }
  return null;
}

schema.statics.updateMetadata = function (_id, _user, metadata) {
  const {
    name,
    year = null,
    month = null,
    day = null,
    latitude = null,
    longitude = null,
    pmid,
    userDefined } = metadata;
  const country = getCountryCode(latitude, longitude);
  return this.update({ _id, _user }, {
    name,
    year,
    month,
    day,
    latitude,
    longitude,
    country,
    pmid,
    userDefined,
  }).then(({ nModified }) => ({ nModified, country }));
};

schema.statics.getPrefilterCondition = function ({ user = null, query }) {
  const hasAccess = { $or: [ { _user: user }, { public: true } ] };
  const { prefilter = 'all', uploadedAt } = query;

  if (prefilter === 'all') {
    return Object.assign(hasAccess, { binned: false });
  }

  if (prefilter === 'user') {
    return { binned: false, _user: { $exists: true, $eq: user } };
  }

  if (prefilter === 'upload') {
    return Object.assign(hasAccess, { binned: false, uploadedAt: { $exists: true, $eq: uploadedAt } });
  }

  if (prefilter === 'bin') {
    return Object.assign({ binned: true, _user: { $exists: true, $eq: user } });
  }

  throw new Error(`Invalid genome prefilter: '${prefilter}'`);
};

schema.statics.getSummary = function (fields, props) {
  return getSummary(this, fields, props);
};

module.exports = mongoose.model('Genome', schema);
