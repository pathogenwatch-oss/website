module.exports.id = '9-genomes-move-file-to-analysis';

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collection('genomes')
    .find({
      'analysis.metrics': { $exists: false },
      'analysis.speciator': { $exists: false },
      _file: { $exists: true },
    })
    .toArray()
    .then(docs =>
      Promise.all(docs.map(doc =>
        db.collection('genomefiles')
          .findOne({ _id: doc._file })
          .then(file =>
            db.collection('genomes')
              .update(
                { _id: doc._id },
                { $set: {
                  'analysis.metrics': {
                    contigs: file.metrics.totalNumberOfContigs,
                    N50: file.metrics.contigN50,
                    nucleotides: file.metrics.totalNumberOfNucleotidesInDnaStrings,
                    nonATCG: file.metrics.totalNumberOfNsInDnaStrings,
                    averageNucleotides: file.metrics.averageNumberOfNucleotidesInDnaStrings,
                    minNucleotides: file.metrics.smallestNumberOfNucleotidesInDnaStrings,
                    maxNucleotides: file.metrics.biggestNumberOfNucleotidesInDnaStrings,
                    gcContent: file.metrics.gcContent,
                    N50Data: file.metrics.sumsOfNucleotidesInDnaStrings,
                    N50Contig: {
                      index: file.metrics.assemblyN50Data.sequenceNumber,
                      sum: file.metrics.assemblyN50Data.sum,
                      length: file.metrics.assemblyN50Data.sequenceLength,
                    },
                  },
                  'analysis.specieator': {
                    organismName: file.organismName,
                    organismId: file.organismId,
                  },
                },
                  $unset: { _file: 1 },
                }
              )
          )
      ))
    )
    .then(() => done())
    .catch(done);
};

module.exports.down = function (done) {
  done();
};
