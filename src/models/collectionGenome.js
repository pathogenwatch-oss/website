const mongoose = require('mongoose');
const { Schema } = mongoose;

const { setToObjectOptions } = require('./utils');

const schema = new Schema({
  _collection: { type: Schema.Types.ObjectId, ref: 'Collection' },
  _genome: { type: Schema.Types.ObjectId, ref: 'Genome' },
  fileId: { type: String, required: true },
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
    core: {
      size: Number,
      percentMatched: Number,
      percentAssemblyMatched: Number,
    },
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

schema.statics.findByUuid = function (uuid, projection) {
  return this.findOne({ uuid }, projection);
};

schema.statics.insertRaw = function (docs, options) {
  return new Promise((resolve, reject) => {
    this.collection.insertMany(docs, options, error => {
      console.log('callback', error);
      if (error) {
        reject(error);
      }
      resolve(docs);
    });
  });
};

module.exports = mongoose.model('CollectionGenome', schema);
