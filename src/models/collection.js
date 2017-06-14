const mongoose = require('mongoose');
const { Schema } = mongoose;
const slug = require('slug');

const { setToObjectOptions, addPreSaveHook, getSummary } = require('./utils');
const { NotFoundError } = require('../utils/errors');

const schema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _organism: {
    type: Schema.Types.ObjectId, ref: 'Organism',
    required() {
      return !this.reference;
    },
  },
  alias: { type: String, index: true },
  createdAt: Date,
  binned: { type: Boolean, default: false },
  binnedDate: Date,
  description: String,
  error: String,
  lastAccessedAt: Date,
  lastUpdatedAt: Date,
  progress: {
    completed: Date,
    errors: [ { taskType: String, name: String } ],
    started: { type: Date, default: Date.now },
    results: Object,
    percent: Number,
  },
  pmid: String,
  public: { type: Boolean, default: false },
  private: { type: Boolean, default: false },
  reference: Boolean,
  size: Number,
  organismId: String,
  status: { type: String, default: 'PENDING' },
  subtrees: [ {
    name: String,
    tree: String,
    leafIds: [ String ],
    totalCollection: Number,
    totalPublic: Number,
  } ],
  title: { type: String, index: 'text' },
  tree: String,
  uuid: { type: String, index: true },
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

const commonResults = new Set([ 'mlst', 'paarsnp', 'core' ]);
const nonReferenceResults = new Set([ 'fp' ]);
const organismSpecificResults = {
  90370: new Set([ 'genotyphi' ]),
  485: new Set([ 'ngmast' ]),
};

schema.methods.addUUID = function (uuid) {
  this.uuid = uuid;
  this.status = 'PROCESSING';
  return this.save();
};

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

schema.methods.resultRequired = function (type) {
  if (commonResults.has(type)) {
    return true;
  }

  if (!this.reference && nonReferenceResults.has(type)) {
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

module.exports = mongoose.model('Collection', schema);
