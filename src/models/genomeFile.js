const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  fileId: { type: String, index: true },
  organismId: String,
  organismName: String,
  metrics: {
    totalNumberOfContigs: Number, // totalContigs
    assemblyN50Data: { // n50
      sum: Number,
      sequenceNumber: Number,
      sequenceLength: Number, // contigN50
    },
    contigN50: Number,
    sumsOfNucleotidesInDnaStrings: [ Number ], // contigLengths
    totalNumberOfNucleotidesInDnaStrings: Number, // totalNucleotides
    totalNumberOfNsInDnaStrings: Number, // nonATCG
    averageNumberOfNucleotidesInDnaStrings: Number, // averageNucleotides
    smallestNumberOfNucleotidesInDnaStrings: Number, // minContigLength
    biggestNumberOfNucleotidesInDnaStrings: Number, // maxContigLength
    gcContent: Number,
  },
});

module.exports = mongoose.model('GenomeFile', schema);
