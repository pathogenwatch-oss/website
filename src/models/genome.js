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
  pending: { type: Array, default: null },
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

schema.statics.addAnalysisResult = function (_id, task, result, props) {
  const update = {
    $set: { [`analysis.${task.toLowerCase()}`]: result },
  };

  if (task === 'specieator') {
    update.$set.organismId = result.organismId;
    update.$set.pending = props.pending;
  } else {
    update.$pull = { pending: task };
  }

  return this.update({ _id }, update);
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
    if (uploadedAt && sessionID) {
      hasAccess.$or.push({ _session: sessionID });
    }
    return Object.assign(hasAccess, { binned: false });
  }

  if (prefilter === 'user') {
    return { binned: false, _user: user._id };
  }

  if (prefilter === 'bin') {
    return { binned: true, _user: user._id };
  }

  throw new Error(`Invalid genome prefilter: '${prefilter}'`);
};

schema.statics.getFilterQuery = function (props) {
  const { user, query = {}, sessionID } = props;
  const { searchText } = query;
  const { organismId, reference, owner, country, minDate, maxDate, uploadedAt, sequenceType } = query;

  const findQuery = this.getPrefilterCondition(props);

  if (searchText) {
    findQuery.$text = { $search: searchText };
  }

  if (organismId) {
    findQuery.organismId = organismId;
  }

  if (country) {
    findQuery.country = country;
  }

  if (reference === 'true') {
    findQuery.reference = true;
  } else if (reference === 'false') {
    findQuery.reference = false;
  }

  if (user) {
    if (owner === 'me') {
      findQuery._user = user;
    } else if (owner === 'other') {
      findQuery._user = { $ne: user };
    }
  }

  if (uploadedAt && (user || sessionID)) {
    findQuery.uploadedAt = new Date(uploadedAt);
  }

  if (minDate) {
    findQuery.date = { $exists: true, $gte: new Date(minDate) };
  }

  if (maxDate) {
    findQuery.date = Object.assign(
      findQuery.date || {},
      { $exists: true, $lte: new Date(maxDate) }
    );
  }

  if (organismId && sequenceType) {
    findQuery['analysis.mlst.st'] = sequenceType;
  }

  return findQuery;
};

schema.statics.getSummary = function (fields, props) {
  return getSummary(this, fields, props);
};

schema.statics.initialiseAnalysis = function (_id, tasks) {
  const analysis = tasks.reduce((memo, { task }) => {
    memo[task] = null;
    return memo;
  }, {});
  return this.update({ _id }, { analysis })
    .then(() => analysis);
};

module.exports = mongoose.model('Genome', schema);
