const mongoose = require('mongoose');
const { Schema } = mongoose;
const slug = require('slug');
const rand = require('rand-token');

const { setToObjectOptions, addPreSaveHook, getSummary } = require('./utils');

const uuidGenerator = rand.generator({
  chars: 'abcdefghijklmnopqrstuvwxyz1234567890',
});

const isLeafId = /[0-9a-f]{24}/g;

const Tree = {
  name: String,
  newick: String,
  size: Number,
  populationSize: Number,
  status: { type: String, default: 'PENDING' },
  task: String,
  version: String,
};

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
  createdAt: { type: Date, index: true },
  binned: { type: Boolean, default: false },
  binnedDate: Date,
  description: String,
  error: String,
  genomes: [ { type: Schema.Types.ObjectId, ref: 'Genome' } ],
  lastAccessedAt: Date,
  lastUpdatedAt: Date,
  locations: Array,
  organismId: String,
  pmid: String,
  public: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
  publicationYear: { type: Number, index: true },
  private: { type: Boolean, default: false },
  reference: Boolean,
  showcase: Boolean,
  size: Number,
  subtrees: [ Tree ],
  title: { type: String, index: 'text' },
  tree: Tree,
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

schema.statics.addAnalysisResult = function (_id, task, version, result) {
  const { name, size, newick, populationSize } = result;

  const tree = {
    task,
    version,
    name,
    status: 'READY',
    newick,
    size,
    populationSize,
  };

  if (task === 'tree') {
    tree.name = 'collection';
    return this.update({ _id }, { tree });
  }

  if (task === 'subtree') {
    return this.update({ _id, 'subtrees.name': name }, {
      $set: {
        'subtrees.$': tree,
      },
    });
  }
};

schema.statics.getSubtreeIds = function (subtree) {
  const { newick } = subtree;
  return newick.match(isLeafId) || [];
};

module.exports = mongoose.model('Collection', schema);
