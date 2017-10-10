module.exports.id = require('./utils/getMigrationId.js')(__filename);

const updateDocs = require('./utils/updateDocs.js');

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;

  updateDocs(
    db.collection('collectiongenomes').find(
      {
        metrics: { $exists: true },
        'analysis.metrics': { $exists: false },
      },
      { _id: 1, metrics: 1 }
    ),
    ({ _id, metrics }) =>
      db.collection('collectiongenomes').update(
        { _id },
        {
          $set: {
            'analysis.metrics': {
              length: metrics.totalNumberOfNucleotidesInDnaStrings,
              contigs: metrics.totalNumberOfContigs,
              smallestContig: metrics.smallestNumberOfNucleotidesInDnaStrings,
              largestContig: metrics.biggestNumberOfNucleotidesInDnaStrings,
              averageContig: metrics.averageNumberOfNucleotidesInDnaStrings,
              N50: metrics.contigN50,
              N50Contig: metrics.assemblyN50Data.sequenceNumber,
              nonATCG: metrics.totalNumberOfNsInDnaStrings,
              gcContent: metrics.gcContent,
              contigSums: metrics.sumsOfNucleotidesInDnaStrings,
            },
          },
          $unset: { metrics: 1 },
        }
      )
  )
  .then(() => done())
  .catch(done);
};

module.exports.down = function (done) {
  done();
};
