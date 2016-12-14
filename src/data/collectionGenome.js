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

const groupResultsByType =
  Object.keys(schema.tree.analysis).reduce((memo, type) => {
    memo[type] = {
      $sum: {
        $cond: {
          if: { $ifNull: [ `analysis.${type}`, false ] },
          then: 1,
          else: 0,
        },
      },
    };
    return memo;
  }, { _id: 'results' });

schema.statics.countResults = function (collection) {
  return this.aggregate([
    { $match: { _collection: collection._id } },
    { $project: { analysis: 1 } },
    { $group: groupResultsByType },
  ]);
};

module.exports = mongoose.model('CollectionGenome', schema);
