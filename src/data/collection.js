const mongoose = require('mongoose');
const { Schema } = mongoose;

const { setToObjectOptions } = require('./utils');

const schema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  genomes: Array,
  description: String,
  uuid: { type: String, index: true },
  size: Number,
  speciesId: Number,
  status: { type: String, default: 'PENDING' },
  error: String,
  progress: {
    completed: Date,
    errors: Array,
    started: { type: Date, default: Date.now },
    results: Object,
    percent: Number,
  },
  subtrees: [ {
    name: String,
    tree: String,
    leafIds: [ String ],
    totalCollection: Number,
    totalPublic: Number,
  } ],
  title: String,
  tree: String,
});

setToObjectOptions(schema);

const commonResults = [ 'FP', 'MLST', 'PAARSNP', 'CORE' ];
const speciesSpecificResults = {
  90370: [ 'GENOTYPHI' ],
  485: [ 'NGMAST' ],
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
  if (new Set(commonResults).has(type)) {
    return true;
  }

  if (this.speciesId in speciesSpecificResults) {
    return new Set(speciesSpecificResults[this.speciesId]).has(type);
  }

  return false;
};

schema.virtual('isProcessing').get(function () {
  return this.status === 'PROCESSING';
});

schema.virtual('totalGenomeResults').get(function () {
  return commonResults.length +
    (this.speciesId in speciesSpecificResults ?
      speciesSpecificResults[this.speciesId].length : 0);
});

const totalTreeResults = 2;
schema.virtual('totalResultsExpected').get(function () {
  return this.size * this.totalGenomeResults + totalTreeResults;
});

schema.statics.findByUuid = function (uuid, projection) {
  return this.findOne({ uuid }, projection);
};

module.exports = mongoose.model('Collection', schema);
