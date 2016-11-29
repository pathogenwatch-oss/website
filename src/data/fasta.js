const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  id: String,
  speciesId: Number,
  metrics: {
    totalContigs: Number, // totalNumberOfContigs
    n50: { // assemblyN50Data
      sum: Number,
      sequenceNumber: Number,
      sequenceLength: Number, // also contigN50
    },
    contigLengths: [ Number ], // sumsOfNucleotidesInDnaStrings
    totalNucleotides: Number, // totalNumberOfNucleotidesInDnaStrings
    nonATCG: Number, // totalNumberOfNsInDnaStrings
    averageNucleotides: Number, // averageNumberOfNucleotidesInDnaStrings
    minContigLength: Number, // smallestNumberOfNucleotidesInDnaStrings
    maxContigLength: Number, // biggestNumberOfNucleotidesInDnaStrings
    gcContent: Number,
  },
});

module.exports = mongoose.model('Fasta', schema);
