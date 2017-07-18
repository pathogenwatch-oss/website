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
                length: doc.metrics.totalNumberOfNucleotidesInDnaStrings,
                contigs: doc.metrics.totalNumberOfContigs,
                smallestContig: doc.metrics.smallestNumberOfNucleotidesInDnaStrings,
                largestContig: doc.metrics.biggestNumberOfNucleotidesInDnaStrings,
                averageContig: doc.metrics.averageNumberOfNucleotidesInDnaStrings,
                N50: doc.metrics.contigN50,
                N50Contig: doc.metrics.assemblyN50Data.sequenceNumber,
                nonATCG: doc.metrics.totalNumberOfNsInDnaStrings,
                gcContent: doc.metrics.gcContent,
                contigSums: doc.metrics.sumsOfNucleotidesInDnaStrings,
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
