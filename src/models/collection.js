const mongoose = require('mongoose');
const { Schema } = mongoose;
const slug = require('slug');

const { setToObjectOptions, addPreSaveHook } = require('./utils');

const schema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _species: {
    type: Schema.Types.ObjectId, ref: 'Species',
    required() {
      return !this.reference;
    },
  },
  createdAt: Date,
  binned: { type: Boolean, default: false },
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
  reference: Boolean,
  size: Number,
  speciesId: String,
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

setToObjectOptions(schema);
addPreSaveHook(schema);

const commonResults = new Set([ 'mlst', 'paarsnp', 'core' ]);
const nonReferenceResults = new Set([ 'fp' ]);
const speciesSpecificResults = {
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

  if (this.speciesId in speciesSpecificResults) {
    return speciesSpecificResults[this.speciesId].has(type);
  }

  return false;
};

schema.virtual('isProcessing').get(function () {
  return this.status === 'PROCESSING';
});

schema.virtual('totalGenomeResults').get(function () {
  return (
    commonResults.size +
    (this.reference ? 0 : nonReferenceResults.size) +
    (this.speciesId in speciesSpecificResults ?
      speciesSpecificResults[this.speciesId].size : 0)
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

schema.statics.getPrefilterCondition = function ({ user = {}, query }) {
  const hasAccess = user._id ?
    { $or: [ { _user: user._id }, { public: true } ] } :
    { public: true };
  const { prefilter = 'all' } = query;

  if (prefilter === 'all') {
    return Object.assign(hasAccess, { binned: false });
  }

  if (prefilter === 'user') {
    return { binned: false, _user: { $exists: true, $eq: user._id } };
  }

  if (prefilter === 'bin') {
    return Object.assign(hasAccess, { binned: true });
  }

  throw new Error(`Invalid collection prefilter: '${prefilter}'`);
};

module.exports = mongoose.model('Collection', schema);
