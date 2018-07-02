const mongoose = require('mongoose');
const { Schema } = mongoose;
const rand = require('rand-token');

const { setToObjectOptions, addPreSaveHook, getSummary, toSlug, getBinExpiryDate } = require('./utils');

const isLeafId = /[0-9a-f]{24}/g;

const Tree = {
  name: String,
  newick: String,
  size: Number,
  populationSize: Number,
  status: { type: String, default: 'PENDING' },
  task: String,
  versions: {
    core: String,
    tree: String,
  },
};

const accessLevels = [ 'private', 'shared', 'public' ];

const randGenerator = rand.generator({
  chars: 'abcdefghijklmnopqrstuvwxyz1234567890',
});

const getDefaultToken = () => randGenerator.generate(12);

const schema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _organism: { type: Schema.Types.ObjectId, ref: 'Organism' },
  access: { type: String, enum: accessLevels, default: 'private' },
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
  published: { type: Boolean, default: false },
  publicationYear: { type: Number, index: true },
  reference: Boolean,
  showcase: Boolean,
  size: Number,
  subtrees: [ Tree ],
  title: { type: String, index: 'text' },
  token: { type: String, index: true, unique: true, default: getDefaultToken },
  tree: { type: Tree, default: null },
});

setToObjectOptions(schema, (doc, collection, { user }) => {
  const { _user } = collection;
  const { id } = user || {};
  if (_user && _user.toString() === id) {
    collection.owner = 'me';
  } else {
    collection.owner = 'other';
    delete collection.access;
  }
  collection.id = doc._id.toString();
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

schema.statics.getPrefilterCondition = function ({ user, query = {} }) {
  const { prefilter = 'all' } = query;

  if (prefilter === 'all') {
    const hasAccess = { $or: [ { access: 'public' } ] };
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

  throw new Error(`Invalid collection prefilter: '${prefilter}'`);
};

schema.statics.getSummary = function (fields, props) {
  return getSummary(this, fields, props);
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
    findQuery.access = 'public';
  } else if (type === 'private') {
    findQuery.access = { $in: [ 'private', 'shared' ] };
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

schema.statics.addAnalysisResult = function (_id, task, result) {
  const { name, size, newick, populationSize, versions } = result;

  const tree = {
    task,
    versions,
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

schema.statics.generateToken = function (title) {
  const sections = [ getDefaultToken() ];
  if (title) sections.push(toSlug(title));
  return sections.join('-');
};

module.exports = mongoose.model('Collection', schema);
