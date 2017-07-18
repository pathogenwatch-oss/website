module.exports.id = '10-collectiongenomes-move-file-to-analysis';

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collection('collectiongenomes')
    .find({
      metrics: { $exists: true },
      'analysis.metrics': { $exists: false },
    })
    .toArray()
    .then(docs =>
      Promise.all(docs.map(doc =>
        db.collection('collectiongenomes')
          .update(
            { _id: doc._id },
            { $set: {
              'analysis.metrics': {
                contigs: doc.metrics.totalNumberOfContigs,
                N50: doc.metrics.contigN50,
                nucleotides: doc.metrics.totalNumberOfNucleotidesInDnaStrings,
                nonATCG: doc.metrics.totalNumberOfNsInDnaStrings,
                averageNucleotides: doc.metrics.averageNumberOfNucleotidesInDnaStrings,
                minNucleotides: doc.metrics.smallestNumberOfNucleotidesInDnaStrings,
                maxNucleotides: doc.metrics.biggestNumberOfNucleotidesInDnaStrings,
                gcContent: doc.metrics.gcContent,
                N50Data: doc.metrics.sumsOfNucleotidesInDnaStrings,
                N50Contig: {
                  index: doc.metrics.assemblyN50Data.sequenceNumber,
                  sum: doc.metrics.assemblyN50Data.sum,
                  length: doc.metrics.assemblyN50Data.sequenceLength,
                },
              },
            },
              $unset: { metrics: 1 },
            }
          )
      ))
    )
    .then(() => done())
    .catch(done);
};

module.exports.down = function (done) {
  done();
};
