const mongoose = require('mongoose');
const { Schema } = mongoose;
const path = require('path');

const geocoding = require('geocoding');
const { summariseAnalysis } = require('../utils/analysis');

const {
  setToObjectOptions,
  addPreSaveHook,
  getSummary,
  getBinExpiryDate,
} = require('./utils');

function getDate(year, month = 1, day = 1) {
  if (year) {
    return new Date(year, (month || 1) - 1, day || 1);
  }
  return undefined;
}

const schema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  analysis: Object,
  binned: { type: Boolean, default: false },
  binnedDate: Date,
  country: { type: String, index: true },
  createdAt: { type: Date, index: true },
  date: { type: Date, index: true },
  day: Number,
  errored: { type: Array, default: null },
  fileId: { type: String, index: true },
  filename: { type: String, maxLength: 256, set: filename => path.basename(filename) },
  lastAccessedAt: Date,
  lastUpdatedAt: Date,
  latitude: Number,
  longitude: Number,
  month: Number,
  name: { type: String, required: true, index: 'text', maxLength: 256, trim: true },
  pending: { type: Array, default: null },
  pmid: { type: String, maxLength: 16 },
  population: { type: Boolean, default: false, index: true },
  public: { type: Boolean, default: false, index: true },
  reference: { type: Boolean, default: false },
  uploadedAt: Date,
  userDefined: Object,
  year: Number,
});

schema.index({ name: 1 });
schema.index({ public: 1, reference: 1 });

schema.index({ 'analysis.mlst.st': 1 });
schema.index({ 'analysis.cgmlst.st': 1 });
schema.index({ 'analysis.speciator.organismId': 1 });
schema.index({ 'analysis.speciator.speciesId': 1 });
schema.index({ 'analysis.speciator.genusId': 1 });
schema.index({ 'analysis.speciator.organismName': 1 });

function toObject(genome, user = {}) {
  const { id } = user;
  const { _user } = genome;
  genome.owner = (_user && id && _user.toString() === id) ? 'me' : 'other';
  delete genome._user;
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

schema.statics.addPendingTasks = function (_id, tasks) {
  return this.update({ _id }, { $push: { pending: { $each: tasks } } });
};

schema.statics.addAnalysisResults = function (_id, ...analyses) {
  const update = { $set: {}, $pullAll: { pending: [] } };

  for (const analysis of analyses) {
    const { task } = analysis;
    update.$set[`analysis.${task.toLowerCase()}`] = summariseAnalysis(analysis);
    update.$pullAll.pending.push(task);
  }

  return this.update({ _id }, update);
};


schema.statics.addAnalysisError = function (_id, task) {
  return this.update({ _id }, {
    $addToSet: { errored: task },
    $pull: { pending: task },
  });
};

schema.statics.updateMetadata = function (_id, { user }, metadata) {
  const {
    name,
    year,
    month,
    day,
    latitude = null,
    longitude = null,
    pmid,
    userDefined,
  } = metadata;

  const country = getCountryCode(latitude, longitude);

  const query = { _id };
  if (user) {
    query._user = user;
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
  })
  .then(({ nModified }) => ({ nModified, country }));
};

schema.statics.getPrefilterCondition = function ({ user, query = {} }) {
  const { prefilter = 'all' } = query;

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

  if (prefilter === 'bin') {
    return { binned: true, _user: user._id, binnedDate: { $gt: getBinExpiryDate() } };
  }

  throw new Error(`Invalid genome prefilter: '${prefilter}'`);
};

schema.statics.getFilterQuery = function (props) {
  const { user, query = {} } = props;
  const { searchText } = query;
  const {
    organismId,
    speciesId,
    genusId,
    type,
    country,
    minDate,
    maxDate,
    uploadedAt,
    sequenceType,
    resistance,
  } = query;

  const findQuery = this.getPrefilterCondition(props);

  if (searchText) {
    findQuery.$text = { $search: searchText };
  }

  if (country) {
    findQuery.country = country;
  }

  if (type === 'reference') {
    findQuery.reference = true;
  } else if (type === 'public') {
    findQuery.public = true;
    findQuery.reference = false;
  } else if (type === 'private') {
    findQuery.public = false;
    findQuery.reference = false;
  }

  if (uploadedAt && (user)) {
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

  if (organismId) {
    findQuery['analysis.speciator.organismId'] = organismId;
  }

  if (speciesId) {
    findQuery['analysis.speciator.speciesId'] = speciesId;
  }

  if (genusId) {
    findQuery['analysis.speciator.genusId'] = genusId;
  }

  if (sequenceType && (organismId || speciesId || genusId)) {
    findQuery['analysis.mlst.st'] = sequenceType;
  }

  if (resistance) {
    findQuery['analysis.paarsnp.antibiotics'] = {
      $elemMatch: { fullName: resistance, state: 'RESISTANT' },
    };
  }

  return findQuery;
};

schema.statics.getSummary = function (fields, props) {
  return getSummary(this, fields, props);
};

const sortKeys = new Set([
  'createdAt', 'name', 'organism', 'country', 'date', 'type', 'st',
]);
schema.statics.getSort = function (sort = 'createdAt-') {
  const sortOrder = (sort.slice(-1) === '-') ? -1 : 1;
  const sortKey = sortOrder === 1 ? sort : sort.substr(0, sort.length - 1);

  if (!sortKeys.has(sortKey)) return null;

  if (sortKey === 'type') {
    return { public: sortOrder, reference: sortOrder };
  }

  if (sortKey === 'st') {
    return { 'analysis.mlst.st': sortOrder };
  }

  if (sortKey === 'organism') {
    return { 'analysis.speciator.organismName': sortOrder };
  }

  return { [sortKey]: sortOrder };
};

schema.statics.getForCollection = function (query) {
  return this.find(
    query, {
      'analysis.core.fp.reference': 1,
      'analysis.core.summary': 1,
      'analysis.genotyphi': 1,
      'analysis.metrics': 1,
      'analysis.mlst.alleles': 1,
      'analysis.mlst.st': 1,
      'analysis.ngmast': 1,
      'analysis.paarsnp.antibiotics': 1,
      'analysis.paarsnp.paar': 1,
      'analysis.paarsnp.snp': 1,
      'analysis.speciator.organismId': 1,
      country: 1,
      createdAt: 1,
      day: 1,
      latitude: 1,
      longitude: 1,
      month: 1,
      name: 1,
      pmid: 1,
      public: 1,
      reference: 1,
      userDefined: 1,
      year: 1,
    }
  )
  .lean()
  .then(genomes => genomes.map(doc => Object.assign(doc, { uuid: doc._id })));
};

schema.statics.lookupCgMlstScheme = async function (genomeId, user) {
  const query = {
    _id: genomeId,
    'analysis.cgmlst.scheme': { $exists: true },
    ...this.getPrefilterCondition({ user }),
  };
  const projection = { 'analysis.cgmlst.scheme': 1 };
  const genome = await this.findOne(query, projection);
  return genome ? genome.analysis.cgmlst.scheme : undefined;
};

schema.statics.checkAuthorisedForSts = async function (user, sts) {
  // A user says they want info about a list of cgmlst sts
  // Do they have access to at least one genome with those sts?
  const query = {
    'analysis.cgmlst.st': { $in: sts },
    ...this.getPrefilterCondition({ user }),
  };
  const userSts = await this.distinct('analysis.cgmlst.st', query);
  return userSts.length === new Set(sts).size;
};

module.exports = mongoose.model('Genome', schema);
