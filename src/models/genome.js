/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const escapeRegex = require('escape-string-regexp');

const { Schema } = mongoose;

const Collection = require('./collection');

const geocoding = require('../utils/geocoding');
const { summariseAnalysis } = require('../utils/analysis');

const { setToObjectOptions, addPreSaveHook, getSummary, getBinExpiryDate } = require('./utils');

function getDate(year, month = 1, day = 1) {
  if (year) {
    return new Date(year, (month || 1) - 1, day || 1);
  }
  return undefined;
}

const uploadTypes = {
  READS: 'reads',
  ASSEMBLY: 'assembly',
};

const schema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  analysis: Object,
  assembler: {
    error: { type: String, maxLength: 256 },
    qc: Object,
  },
  binned: { type: Boolean, default: false },
  binnedDate: Date,
  country: { type: String, index: true },
  createdAt: { type: Date, index: true },
  date: { type: Date, index: true },
  day: Number,
  errored: { type: Array, default: null },
  fileId: { type: String, index: true },
  lastAccessedAt: Date,
  lastUpdatedAt: Date,
  latitude: Number,
  longitude: Number,
  month: Number,
  name: { type: String, required: true, maxLength: 256, trim: true },
  pending: { type: Array, default: null },
  literatureLink: {
    value: { type: String, maxLength: 256, trim: true },
    type: { type: String, maxLength: 8, trim: true },
  },
  population: { type: Boolean, default: false, index: true },
  public: { type: Boolean, default: false },
  upload: {
    type: { type: String, enum: Object.values(uploadTypes) },
    files: { type: [ String ] },
    complete: { type: Boolean, default: false },
  },
  reference: { type: Boolean, default: false },
  uploadedAt: Date,
  userDefined: Object,
  year: Number,
});

schema.index({ name: 1 });
schema.index({ name: 'text' });
schema.index({ reference: 1 });
schema.index({ uploadedAt: 1 });
schema.index({
  'analysis.mlst.st': 1,
  'analysis.mlst2.st': 1,
}, { partialFilterExpression: { 'analysis.mlst': { $exists: true } } });
schema.index({ 'analysis.mlst2.st': 1 }, { partialFilterExpression: { 'analysis.mlst2': { $exists: true } } });
schema.index({ 'analysis.cgmlst.st': 1 }, { partialFilterExpression: { 'analysis.cgmlst': { $exists: true } } });
schema.index({
  'analysis.paarsnp.antibiotics.fullName': 1,
  'analysis.paarsnp.antibiotics.state': 1,
}, { partialFilterExpression: { 'analysis.paarsnp': { $exists: true } } });
schema.index({ 'analysis.paarsnp.antibiotics.state': 1 }, { partialFilterExpression: { 'analysis.paarsnp': { $exists: true } } });
schema.index({ 'analysis.speciator.organismName': 1 }, { partialFilterExpression: { 'analysis.speciator': { $exists: true } } });
schema.index({ 'analysis.speciator.speciesId': 1 }, { partialFilterExpression: { 'analysis.speciator': { $exists: true } } });
schema.index({ 'analysis.speciator.genusId': 1 }, { partialFilterExpression: { 'analysis.speciator': { $exists: true } } });
schema.index({ 'analysis.serotype.subspecies': 1 }, { partialFilterExpression: { 'analysis.serotype': { $exists: true } } });
schema.index({ 'analysis.serotype.value': 1 }, { partialFilterExpression: { 'analysis.serotype': { $exists: true } } });
schema.index({ 'analysis.speciator.speciesName': 1, 'analysis.serotype.subspecies': 1, 'analysis.serotype.value': 1 });
schema.index({ 'upload.type': 1, 'upload.completed': 1 });
schema.index({ 'analysis.poppunk2.strain': 1 }, { partialFilterExpression: { 'analysis.poppunk2': { $exists: true } } });
schema.index({ 'analysis.ngstar.st': 1 }, { partialFilterExpression: { 'analysis.ngstar': { $exists: true } } });
schema.index({ 'analysis.ngmast.ngmast': 1 }, { partialFilterExpression: { 'analysis.ngmast': { $exists: true } } });
schema.index({ 'analysis.genotyphi.genotype': 1 }, { partialFilterExpression: { 'analysis.genotyphi': { $exists: true } } });
schema.index({ 'analysis.core.fp.reference': 1 }, { partialFilterExpression: { 'analysis.core': { $exists: true } } });
schema.index({ 'analysis.kaptive.kLocus.Best locus match': 1 }, { partialFilterExpression: { 'analysis.kaptive': { $exists: true } } });
schema.index({ 'analysis.kaptive.oLocus.Best locus match': 1 }, { partialFilterExpression: { 'analysis.kaptive': { $exists: true } } });
schema.index({ 'analysis.kleborate.typing.K_locus': 1 }, { partialFilterExpression: { 'analysis.kleborate': { $exists: true } } });
schema.index({ 'analysis.kleborate.typing.O_locus': 1 }, { partialFilterExpression: { 'analysis.kleborate': { $exists: true } } });
schema.index({ 'analysis.klebsiella-lincodes.cgST': 1 }, { partialFilterExpression: { 'analysis.klebsiella-lincodes': { $exists: true } } });
schema.index({ 'analysis.pangolin.lineage': 1 }, { partialFilterExpression: { 'analysis.pangolin': { $exists: true } } });
schema.index({ 'analysis.sarscov2-variants.variants.state': 1 }, { partialFilterExpression: { 'analysis.sarscov2-variants': { $exists: true } } });
schema.index({ 'analysis.sarscov2-variants.variants.name': 1 }, { partialFilterExpression: { 'analysis.sarscov2-variants': { $exists: true } } });

schema.index({
  public: 1,
  binned: 1,
  reference: 1,
  _user: 1,
});

schema.index({
  public: 1,
  binned: 1,
  'analysis.speciator.organismId': 1,
  'analysis.speciator.organismName': 1,
}, { partialFilterExpression: { public: true, binned: false } });
schema.index({
  _user: 1,
  binned: 1,
  'analysis.speciator.organismId': 1,
  'analysis.speciator.organismName': 1,
}, { partialFilterExpression: { binned: false } });
schema.index({
  public: 1,
  binned: 1,
  'analysis.cgmlst.scheme': 1,
}, { partialFilterExpression: { public: true, binned: false } });
schema.index({
  _user: 1,
  binned: 1,
  'analysis.cgmlst.scheme': 1,
});
// Need these for the sorts
schema.index({ public: 1, binned: 1, createdAt: -1 }, { partialFilterExpression: { public: true, binned: false } });
schema.index({ _user: 1, binned: 1, createdAt: -1 });
schema.index({
  public: 1,
  binned: 1,
  'analysis.speciator.organismId': 1,
  createdAt: -1,
}, { partialFilterExpression: { public: true, binned: false } });
schema.index({
  _user: 1,
  binned: 1,
  'analysis.speciator.organismId': 1,
  createdAt: -1,
}, { partialFilterExpression: { binned: false } });
schema.index({ public: 1, _user: 1, binned: 1, createdAt: -1 }, {
  partialFilterExpression: {
    public: false,
    binned: false,
  },
});
schema.index({
  "_user": 1,
  "binned": 1,
  "analysis.speciator.organismId": 1,
  "analysis.mlst.st": 1,
  "analysis.mlst2.st": 1,
});

schema.statics.uploadTypes = uploadTypes;

schema.statics.taxonomy = (genome) => {
  const speciator = (genome.analysis || {}).speciator || {};
  const includes = (taxid) =>
    taxid && [ speciator.organismId, speciator.speciesId, speciator.genusId ].includes(taxid);
  return {
    includes,
    isIn(taxids) {
      for (const taxid of taxids) {
        if (includes(taxid)) return true;
      }
      return false;
    },
  };
};

function toObject(genome, user = {}) {
  const { id } = user;
  const { _user } = genome;
  genome.owner = _user && id && _user.toString() === id ? 'me' : 'other';
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
    return geocoding.getCountryCode(Number.parseFloat(latitude), Number.parseFloat(longitude));
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
  return this.update(
    { _id },
    {
      $addToSet: { errored: task },
      $pull: { pending: task },
    }
  );
};

schema.statics.getMetadataUpdate = function (metadata) {
  const {
    name,
    year = null,
    month = null,
    day = null,
    latitude = null,
    longitude = null,
    literatureLink,
    userDefined,
  } = metadata;
  const country = getCountryCode(latitude, longitude);
  return {
    name,
    year,
    month,
    day,
    date: getDate(year, month, day),
    latitude,
    longitude,
    country,
    literatureLink,
    userDefined,
  };
};

schema.statics.updateMetadata = async function (_id, { user }, metadata) {
  const query = { _id };
  if (user) {
    query._user = user;
  }
  const update = this.getMetadataUpdate(metadata);
  await this.update(query, update);
  return { country: update.country };
};

schema.statics.getPrefilterCondition = function ({ user, query = {} }, currentFilters = {}) {
  const { prefilter = 'all' } = query;

  if (prefilter === 'all') {
    const hasAccess = { $or: [] };
    if (!('public' in currentFilters) || currentFilters.public === true) {
      hasAccess.$or.push({ public: true, binned: false, ...currentFilters });
    }
    if (user) {
      hasAccess.$or.push({ _user: user._id, binned: false, ...currentFilters });
    }
    return Object.assign(hasAccess);
  }

  if (prefilter === 'user') {
    return { binned: false, _user: user._id, ...currentFilters };
  }

  if (prefilter === 'bin') {
    return { binned: true, _user: user._id, binnedDate: { $gt: getBinExpiryDate() }, ...currentFilters };
  }

  throw new Error(`Invalid genome prefilter: '${prefilter}'`);
};

schema.statics.getFilterQuery = async function (props, findQuery = {}) {
  const { user, query = {} } = props;
  const {
    collection,
    organismCgmlst,
    organismCollection,
    country,
    genotype,
    genusId,
    id,
    klocus,
    klocusKaptive,
    lincodeCgst,
    maxDate,
    minDate,
    ngmast,
    ngstar,
    olocus,
    olocusKaptive,
    organismId,
    pangolin,
    resistance,
    "sarscov2-variants": sarscov2Variants,
    searchText,
    serotype,
    sequenceType,
    mlst = sequenceType,
    sequenceType2,
    mlst2 = sequenceType2,
    speciesId,
    strain,
    subspecies,
    type,
    access = type,
    reference = type === 'reference' ? 'true' : undefined,
    uploadedAt,
  } = query;

  if (id) {
    findQuery._id = { $in: [].concat(id).map((hexCode) => mongoose.Types.ObjectId(hexCode)) };
  }

  if (collection) {
    findQuery._id = { $in: await Collection.getGenomeIds(collection, props) };
  }

  if (organismCollection) {
    findQuery['analysis.speciator.organismId'] = organismCollection;
  }

  if (organismCgmlst) {
    findQuery['analysis.speciator.organismId'] = organismCgmlst;
  }

  if (searchText) {
    findQuery.name = { $regex: escapeRegex(searchText), $options: 'i' };
  }

  if (country) {
    findQuery.country = country;
  }

  if (reference) {
    findQuery['analysis.core.fp.reference'] = reference;
  }

  if (access === 'public') {
    findQuery.public = true;
    findQuery.reference = false;
  } else if (access === 'private') {
    findQuery.public = false;
  } else if (access === 'reference') {
    findQuery.reference = true;
  }

  if (uploadedAt && (user && user._id)) {
    findQuery.uploadedAt = new Date(uploadedAt);
  }

  if (minDate) {
    findQuery.date = { $exists: true, $gte: new Date(minDate) };
  }

  if (maxDate) {
    findQuery.date = Object.assign(findQuery.date || {}, {
      $exists: true,
      $lte: new Date(maxDate),
    });
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

  if (mlst) {
    findQuery['analysis.mlst.st'] = mlst;
  }

  if (mlst2) {
    findQuery['analysis.mlst2.st'] = mlst2;
  }

  if (subspecies) {
    if (subspecies === 'SARS-CoV-2') {
      findQuery['analysis.speciator.organismName'] = subspecies;
    } else {
      findQuery['analysis.serotype.subspecies'] = subspecies;
    }
  }

  if (serotype) {
    findQuery['analysis.serotype.value'] = serotype;
  }

  if (klocus) {
    findQuery['analysis.kleborate.typing.K_locus'] = klocus;
  }

  if (olocus) {
    findQuery['analysis.kleborate.typing.O_locus'] = olocus;
  }

  if (klocusKaptive) {
    findQuery['analysis.kaptive.kLocus.Best match locus'] = klocusKaptive;
  }

  if (olocusKaptive) {
    findQuery['analysis.kaptive.oLocus.Best match locus'] = olocusKaptive;
  }

  if (pangolin) {
    findQuery['analysis.pangolin.lineage'] = pangolin;
  }

  if (sarscov2Variants) {
    findQuery['analysis.sarscov2-variants.variants'] = {
      $elemMatch: { name: sarscov2Variants, state: 'var' },
    };
  }

  if (strain) {
    findQuery['analysis.poppunk2.strain'] = strain;
  }

  if (ngmast) {
    findQuery['analysis.ngmast.ngmast'] = ngmast;
  }

  if (ngstar) {
    findQuery['analysis.ngstar.st'] = ngstar;
  }

  if (genotype) {
    findQuery['analysis.genotyphi.genotype'] = genotype;
  }

  if (resistance) {
    findQuery['analysis.paarsnp.resistanceProfile'] = {
      $elemMatch: { 'agent.name': resistance, state: 'RESISTANT' },
    };
  }

  if (lincodeCgst) {
    findQuery['analysis.klebsiella-lincodes.cgST'] = lincodeCgst;
  }

  return this.getPrefilterCondition(props, findQuery);
};

schema.statics.getSummary = function (fields, props) {
  return getSummary(this, fields, props);
};

const sortKeys = new Set([ 'createdAt', 'name', 'organism', 'country', 'date', 'type', 'mlst' ]);
schema.statics.getSort = function (sort = 'createdAt-') {
  const sortOrder = sort.slice(-1) === '-' ? -1 : 1;
  const sortKey = sortOrder === 1 ? sort : sort.substr(0, sort.length - 1);

  if (!sortKeys.has(sortKey)) return null;

  if (sortKey === 'access') {
    return { public: sortOrder, reference: sortOrder };
  }

  if (sortKey === 'mlst') {
    return {
      'analysis.mlst.st': sortOrder,
      'analysis.mlst2.st': sortOrder,
    };
  }

  if (sortKey === 'organism') {
    return {
      'analysis.speciator.speciesName': sortOrder,
      'analysis.serotype.subspecies': sortOrder,
      'analysis.serotype.value': sortOrder,
    };
  }

  return { [sortKey]: sortOrder };
};

schema.statics.getForCollection = function (query, user = {}) {
  return this.find(query, {
    'analysis.klebsiella-lincodes': 1,
    'analysis.core.fp.reference': 1,
    'analysis.core.summary': 1,
    'analysis.genotyphi': 1,
    'analysis.inctyper': 1,
    'analysis.kaptive': 1,
    'analysis.kleborate': 1,
    'analysis.metrics': 1,
    'analysis.mlst.alleles': 1,
    'analysis.mlst.source': 1,
    'analysis.mlst.st': 1,
    'analysis.mlst2.alleles': 1,
    'analysis.mlst2.source': 1,
    'analysis.mlst2.st': 1,
    'analysis.ngmast': 1,
    'analysis.ngono-markers.status': 1,
    'analysis.ngstar.alleles': 1,
    'analysis.ngstar.source': 1,
    'analysis.ngstar.st': 1,
    'analysis.paarsnp.__v': 1,
    'analysis.paarsnp.resistanceProfile': 1,
    'analysis.paarsnp.acquired': 1,
    'analysis.paarsnp.variants': 1,
    'analysis.paarsnp.library': 1,
    'analysis.pangolin': 1,
    'analysis.sarscov2-variants': 1,
    'analysis.serotype': 1,
    'analysis.speciator.organismId': 1,
    'analysis.spn_pbp_amr': 1,
    'analysis.vista': 1,
    country: 1,
    createdAt: 1,
    day: 1,
    latitude: 1,
    longitude: 1,
    month: 1,
    name: 1,
    literatureLink: 1,
    public: 1,
    reference: 1,
    userDefined: 1,
    year: 1,
    _user: 1,
  })
    .lean()
    .then((genomes) => genomes.map((doc) => toObject(doc, user)));
};

schema.statics.lookupCgMlstScheme = async function (genomeId, user) {
  const query = {
    _id: genomeId,
    'analysis.cgmlst.scheme': { $exists: true },
    ...this.getPrefilterCondition({ user }),
  };
  const projection = { 'analysis.cgmlst.scheme': 1 };
  const genome = await this.findOne(query, projection);
  if (user && genome === undefined) return this.lookupCgMlstScheme(genomeId, undefined);
  return genome ? genome.analysis.cgmlst.scheme : undefined;
};

schema.statics.lookupOrganism = async function (genomeId, user) {
  const query = {
    _id: genomeId,
    'analysis.speciator': { $exists: true },
    ...this.getPrefilterCondition({ user }),
  };
  const projection = { 'analysis.speciator.organismId': 1, 'analysis.speciator.organismName': 1 };
  const genome = await this.findOne(query, projection);
  if (user && genome === undefined) return this.lookupOrganism(genomeId, undefined);
  return genome ? {
    organismId: genome.analysis.speciator.organismId,
    organismName: genome.analysis.speciator.organismName
  } : undefined;
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
