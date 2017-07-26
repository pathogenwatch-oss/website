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
                  fileId: file.fileId,
                  'analysis.metrics': {
                    length: file.metrics.totalNumberOfNucleotidesInDnaStrings,
                    contigs: file.metrics.totalNumberOfContigs,
                    smallestContig: file.metrics.smallestNumberOfNucleotidesInDnaStrings,
                    largestContig: file.metrics.biggestNumberOfNucleotidesInDnaStrings,
                    averageContig: file.metrics.averageNumberOfNucleotidesInDnaStrings,
                    N50: file.metrics.contigN50,
                    N50Contig: file.metrics.assemblyN50Data.sequenceNumber,
                    nonATCG: file.metrics.totalNumberOfNsInDnaStrings,
                    gcContent: file.metrics.gcContent,
                    contigSums: file.metrics.sumsOfNucleotidesInDnaStrings,
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
