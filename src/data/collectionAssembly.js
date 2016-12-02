const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  _fasta: { type: Schema.Types.ObjectId, ref: 'Fasta' },
  _collection: { type: Schema.Types.ObjectId, ref: 'Collection' },
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
  pmid: String,
  userDefined: Object,
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
    resistanceProfile: {
      antibiotics: [ { name: String, state: String, mechanisms: [ String ] } ],
      paar: [],
      snp: [],
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

module.exports = mongoose.model('CollectionAssembly', schema);
