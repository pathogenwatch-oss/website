const mongoose = require('mongoose');
const { Schema } = mongoose;

const { setToObjectOptions } = require('./utils');

const schema = new Schema({
  _collection: { type: Schema.Types.ObjectId, ref: 'Collection' },
  fileId: { type: String, required: true },
  uuid: { type: String, required: true },
  name: { type: String, required: true },
  date: {
    year: Number,
    month: Number,
    day: Number,
  },
  position: {
    latitude: String,
    longitude: String,
  },
  country: String,
  pmid: String,
  userDefined: Object,
  metrics: Object,
  analysis: {
    fp: {
      subtype: String,
    },
    mlst: {
      st: Number,
      code: String,
    },
    core: {
      size: Number,
      percentMatched: Number,
      percentAssemblyMatched: Number,
    },
    paarsnp: {
      // [ { name: String, state: String, mechanisms: [ String ] } ],
      antibiotics: Schema.Types.Mixed,
      paar: Schema.Types.Mixed,
      snp: Schema.Types.Mixed,
    },
    ngmast: {
      ngmast: String,
      por: String,
      tbpb: String,
    },
    genotyphi: {
      genotype: String,
    },
  },
});

setToObjectOptions(schema);

schema.statics.addAnalysisResult = function (uuid, name, result) {
  return this.update({ uuid }, { [`analysis.${name.toLowerCase()}`]: result });
};

const projectResultsByType = {
  analysis: Object.keys(schema.tree.analysis).map(type => ({
    type,
    count: {
      $cond: {
        if: { $ifNull: [ `$analysis.${type}`, false ] },
        then: 1,
        else: 0,
      },
    },
  })),
};

schema.statics.countResults = function (collection) {
  return this.aggregate([
    { $match: { _collection: collection._id } },
    { $project: projectResultsByType },
    { $unwind: '$analysis' },
    { $group: { _id: '$analysis.type', count: { $sum: '$analysis.count' } } },
    { $project: { type: '$_id', _id: 0, count: 1 } },
  ]);
};

schema.statics.countUniqueSubtypes = function (collection) {
  return this.aggregate([
    { $match: { _collection: collection._id } },
    { $project: { 'analysis.fp.subtype': 1 } },
    { $group: { _id: '$analysis.fp.subtype', count: { $sum: 1 } } },
    { $project: { subtype: '$_id', _id: 0, count: 1 } },
  ]);
};

module.exports = mongoose.model('CollectionGenome', schema);
