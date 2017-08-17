module.exports.id = require('./utils/getMigrationId.js')(__filename);

const updateDocs = require('./utils/updateDocs.js');

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;

  updateDocs(
    db.collection('genomes').find(
      {
        'analysis.metrics': { $exists: false },
        'analysis.speciator': { $exists: false },
        _file: { $exists: true },
      },
      { _id: 1, _file: 1 }
    ),
    ({ _id, _file }) =>
      db.collection('genomefiles')
        .findOne({ _id: _file }, { fileId: 1, metrics: 1, organismId: 1, organismName: 1 })
        .then(({ fileId, metrics, organismId, organismName }) =>
          db.collection('genomes').update(
            { _id },
            { $set: {
              fileId,
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
              'analysis.specieator': { organismName, organismId },
            },
              $unset: { _file: 1 },
            }
          )
        )
  )
  .then(() => done())
  .catch(done);
};

module.exports.down = function (done) {
  done();
};
