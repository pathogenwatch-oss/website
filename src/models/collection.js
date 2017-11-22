const mongoose = require('mongoose');
const { Schema } = mongoose;
const slug = require('slug');
const rand = require('rand-token');

const { setToObjectOptions, addPreSaveHook, getSummary } = require('./utils');
const { NotFoundError } = require('../utils/errors');

const uuidGenerator = rand.generator({
  chars: 'abcdefghijklnmopqrstuvwxyz1234567890',
});

const schema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _organism: {
    type: Schema.Types.ObjectId, ref: 'Organism',
    required() {
      return !this.reference;
    },
  },
  _session: String,
  alias: { type: String, index: true },
  analysis: Object,
  createdAt: { type: Date, index: true },
  binned: { type: Boolean, default: false },
  binnedDate: Date,
  description: String,
  error: String,
  genomes: [ {
    _genome: { type: Schema.Types.ObjectId, ref: 'Genome' },
    fileId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    date: {
      year: Number,
      month: Number,
      day: Number,
    },
    position: {
      latitude: Number,
      longitude: Number,
    },
    country: String,
    pmid: String,
    userDefined: Object,
    subtree: String,
  } ],
  lastAccessedAt: Date,
  lastUpdatedAt: Date,
  locations: Array,
  organismId: String,
  progress: {
    completed: Date,
    errors: [ { taskType: String, name: String } ],
    percent: Number,
    results: Object,
    started: { type: Date, default: Date.now },
  },
  pmid: String,
  public: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
  publicationYear: { type: Number, index: true },
  private: { type: Boolean, default: false },
  reference: Boolean,
  showcase: Boolean,
  size: Number,
  status: { type: String, default: 'PROCESSING' },
  subtrees: [ {
    name: String,
    tree: String,
    collectionIds: [ String ],
    publicIds: [ String ],
    totalCollection: Number,
    totalPublic: Number,
  } ],
  title: { type: String, index: 'text' },
  tree: String,
  uuid: { type: String, index: true, default: () => uuidGenerator.generate(12) },
});

setToObjectOptions(schema, (doc, collection, { user }) => {
  const { _user } = collection;
  const { id } = user || {};
  collection.owner = _user && _user.toString() === id ? 'me' : 'other';
  collection.id = doc._id.toString();
  collection.slug = doc.slug;
  delete collection._user;
  delete collection._id;
  if (typeof collection._organism === 'object') {
    collection.organism = collection._organism;
  }
  delete collection._organism;
  return collection;
});
addPreSaveHook(schema);

schema.methods.failed = function (error) {
  this.status = 'FAILED';
  this.error = error;
  this.progress.completed = new Date();
  return this.save().then(() => error);
};

schema.methods.ready = function () {
  this.status = 'READY';
  this.progress.completed = new Date();
  return this.save();
};

const commonResults = new Set([ 'core', 'metrics' ]);
const nonReferenceResults = new Set([ ]);
const standardAnalyses = new Set([ 'mlst', 'paarsnp' ]);
const standardOrganisms = new Set([ '1280', '90370', '485', '1313' ]);
const organismSpecificResults = {
  90370: new Set([ 'genotyphi' ]),
  485: new Set([ 'ngmast' ]),
};

schema.methods.resultRequired = function (type) {
  if (commonResults.has(type)) {
    return true;
  }

  if (!this.reference && nonReferenceResults.has(type)) {
    return true;
  }

  if (standardOrganisms.has(this.organismId) && standardAnalyses.has(type)) {
    return true;
  }

  if (this.organismId in organismSpecificResults) {
    return organismSpecificResults[this.organismId].has(type);
  }

  return false;
};

schema.methods.ensureAccess = function (user) {
  if (!this.private) {
    return this;
  }

  if (user && this._user && this._user.equals(user._id)) {
    return this;
  }

  throw new NotFoundError('No collection found for this user');
};

schema.virtual('isProcessing').get(function () {
  return this.status === 'PROCESSING';
});

schema.virtual('totalGenomeResults').get(function () {
  return (
    commonResults.size +
    (this.reference ? 0 : nonReferenceResults.size) +
    (standardOrganisms.has(this.organismId) ? standardAnalyses.size : 0) +
    (this.organismId in organismSpecificResults ?
      organismSpecificResults[this.organismId].size : 0)
  );
});

const totalTreeResults = 2;
schema.virtual('totalResultsExpected').get(function () {
  return this.size * this.totalGenomeResults + totalTreeResults;
});

function toSlug(text) {
  if (!text) return '';

  const slugText = `-${slug(text, { lower: true })}`;
  return slugText.length > 64 ?
    slugText.slice(0, 64) :
    slugText;
}

schema.virtual('slug').get(function () {
  return `${this.uuid}${toSlug(this.title)}`;
});

schema.statics.findByUuid = function (uuid, projection) {
  return this.findOne({ uuid }, projection);
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
    return { binned: true, _user: user._id };
  }

  throw new Error(`Invalid collection prefilter: '${prefilter}'`);
};

schema.statics.getSummary = function (fields, props) {
  return getSummary(this, fields, props);
};

schema.statics.alias = function (uuid, alias) {
  return this.update({ uuid }, { $set: { alias } });
};

schema.statics.getFilterQuery = function (props) {
  const { query = {} } = props;
  const {
    searchText, organismId, type, minDate, maxDate, publicationYear,
  } = query;

  const findQuery = this.getPrefilterCondition(props);

  if (searchText) {
    findQuery.$text = { $search: searchText };
  }

  if (organismId) {
    findQuery.organismId = organismId;
  }

  if (type === 'public') {
    findQuery.public = true;
  } else if (type === 'private') {
    findQuery.public = false;
  }

  if (minDate) {
    findQuery.createdAt = { $gte: new Date(minDate) };
  }

  if (maxDate) {
    findQuery.createdAt = Object.assign(
      findQuery.createdAt || {},
      { $lte: new Date(maxDate) }
    );
  }

  if (publicationYear && !isNaN(publicationYear)) {
    findQuery.publicationYear = Number(publicationYear);
  }

  return findQuery;
};

const sortKeys = new Set([
  'createdAt', 'title', 'size', 'publicationYear',
]);
schema.statics.getSort = function (sort = 'createdAt-') {
  const sortOrder = (sort.slice(-1) === '-') ? -1 : 1;
  const sortKey = sortOrder === 1 ? sort : sort.substr(0, sort.length - 1);

  if (!sortKeys.has(sortKey)) return null;

  return { [sortKey]: sortOrder };
};

schema.statics.addAnalysisResult = function (_id, task, version, metadata, result) {
  const update = {};
  if (task === 'tree') {
    update.tree = result.tree;
    update['analysis.tree'] = version;
  } else if (task === 'subtree') {
    update.$push = {
      subtrees: { name: metadata.subtree, tree: result.tree },
    };
    update['analysis.subtree'] = version;
  }
  return this.update({ _id }, update);
};

schema.statics.getGenomes = function (_id, projection = {}) {
  return this.findOne({ _id }, { genomes: projection })
    .lean()
    .then(collection => collection.genomes);
};

module.exports = mongoose.model('Collection', schema);
