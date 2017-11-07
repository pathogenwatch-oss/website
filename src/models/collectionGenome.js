const mongoose = require('mongoose');
const { Schema } = mongoose;

const { setToObjectOptions } = require('./utils');

const schema = new Schema({
  _collection: { type: Schema.Types.ObjectId, ref: 'Collection' },
  _genome: { type: Schema.Types.ObjectId, ref: 'Genome' },
  fileId: { type: String, required: true, index: true },
  uuid: { type: String, required: true },
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
  analysis: {
    core: Object,
    fp: {
      subtype: String,
      referenceName: String,
    },
    genotyphi: {
      genotype: String,
      snps: Number,
      foundLoci: Number,
    },
    metrics: Object,
    mlst: {
      st: String,
      code: String,
      alleles: Array,
      matches: Array,
    },
    paarsnp: {
      // [ { name: String, state: String, mechanisms: [ String ] } ],
      antibiotics: Schema.Types.Mixed,
      paar: Schema.Types.Mixed,
      snp: Schema.Types.Mixed,
      matches: Array,
    },
    ngmast: {
      ngmast: String,
      por: String,
      tbpb: String,
    },
  },
});

setToObjectOptions(schema);

const formatters = {
  paarsnp: result => Object.assign({}, result, {
    antibiotics: result.antibiotics.reduce((memo, antibiotic) => {
      memo[antibiotic.name] = antibiotic;
      return memo;
    }, {}),
  }),
};

schema.statics.formatters = formatters;

schema.statics.addAnalysisResult = function (_id, key, result) {
  const formattedResult = key in formatters ? formatters[key](result) : result;
  return this.update(
    { _id },
    { [`analysis.${key.toLowerCase()}`]: formattedResult }
  );
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

const filterAnalysis = {
  analysis: {
    core: {
      __v: 1,
    },
    fp: 1,
    genotyphi: 1,
    metrics: 1,
    mlst: 1,
    paarsnp: 1,
    ngmast: 1,
  },
};

schema.statics.countResults = function (collection) {
  return this.aggregate([
    { $match: { _collection: collection._id } },
    { $project: filterAnalysis },
    { $project: projectResultsByType },
    { $unwind: '$analysis' },
    { $group: { _id: '$analysis.type', count: { $sum: '$analysis.count' } } },
    { $project: { type: '$_id', _id: 0, count: 1 } },
  ]);
};

schema.statics.findByUuid = function (uuid, projection) {
  return this.findOne({ uuid }, projection);
};

schema.statics.insertRaw = function (docs, options) {
  return new Promise((resolve, reject) => {
    this.collection.insertMany(docs, options, (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result.insertedIds);
    });
  });
};

module.exports = mongoose.model('CollectionGenome', schema);
