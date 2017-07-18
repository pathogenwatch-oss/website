const mongoose = require('mongoose');
const { Schema } = mongoose;

const geocoding = require('geocoding');

const { setToObjectOptions, addPreSaveHook, getSummary } = require('./utils');

function getDate(year, month = 1, day = 1) {
  if (year) {
    return new Date(year, month - 1, day);
  }
  return undefined;
}

const schema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _session: String,
  name: { type: String, required: true, index: 'text' },
  organismId: String,
  fileId: String,
  year: Number,
  month: Number,
  day: Number,
  date: Date,
  latitude: Number,
  longitude: Number,
  country: String,
  pmid: String,
  userDefined: Object,
  analysis: Object,
  public: { type: Boolean, default: false },
  reference: { type: Boolean, default: false },
  binned: { type: Boolean, default: false },
  binnedDate: Date,
  uploadedAt: Date,
  createdAt: Date,
  lastAccessedAt: Date,
  lastUpdatedAt: Date,
});

function toObject(genome, user = {}) {
  const { id } = user;
  const { _user } = genome;
  genome.owner = (_user && id && _user.toString() === id) ? 'me' : 'other';
  delete genome._user;
  delete genome._session;
  if (!genome.id) {
    genome.id = genome._id;
    delete genome._id;
  }
  return genome;
}

setToObjectOptions(schema, (_, genome, { user }) => toObject(genome, user));
schema.statics.toObject = toObject;

addPreSaveHook(schema);

schema.pre('save', function (next) {
  if (this.year) {
    this.date = getDate(this.year, this.month, this.day);
  }
  next();
});

function getCountryCode(latitude, longitude) {
  if (latitude && longitude) {
    return geocoding.getCountryCode(
      Number.parseFloat(latitude),
      Number.parseFloat(longitude)
    );
  }
  return null;
}

schema.statics.addAnalysisResult = function (_id, name, result) {
  return this.update({ _id }, { [`analysis.${name.toLowerCase()}`]: result });
};

schema.statics.updateMetadata = function (_id, { user, sessionID }, metadata) {
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

  const query = { _id };
  if (user) {
    query._user = user;
  } else if (sessionID) {
    query._session = sessionID;
  }

  return this.update(query, {
    name,
    year,
    month,
    day,
    date: getDate(year, month, day),
    latitude,
    longitude,
    country,
    pmid,
    userDefined,
  }).then(({ nModified }) => ({ nModified, country }));
};

schema.statics.getPrefilterCondition = function ({ user, query = {}, sessionID }) {
  const { prefilter = 'all', uploadedAt } = query;

  if (prefilter === 'all') {
    const hasAccess = { $or: [ { public: true } ] };
    if (user) {
      hasAccess.$or.push({ _user: user._id });
    }
    return Object.assign(hasAccess, { binned: false });
  }

  if (prefilter === 'user') {
    return { binned: false, _user: user._id };
  }

  if (prefilter === 'upload') {
    return { binned: false, _session: sessionID, uploadedAt: new Date(uploadedAt || null) };
  }

  if (prefilter === 'bin') {
    return { binned: true, _user: user._id };
  }

  throw new Error(`Invalid genome prefilter: '${prefilter}'`);
};

schema.statics.getSummary = function (fields, props) {
  return getSummary(this, fields, props);
};

module.exports = mongoose.model('Genome', schema);
