module.exports.id = '5-genomefiles-species-to-organism';

module.exports.up = function (done) {
  return done();
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collection('genomefiles').aggregate(
    [
      {
        $match: { speciesId: { $exists: true }, speciesName: { $exists: true } },
      },
      {
        $addFields: { organismId: '$speciesId', organismName: '$speciesName' },
      },
      {
        $project: { speciesId: 0, speciesName: 0 },
      },
      {
        $out: 'genomefiles',
      },
    ],
    done
  );
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collection('genomefiles').aggregate(
    [
      {
        $match: { organismId: { $exists: true }, organismName: { $exists: true } },
      },
      {
        $addFields: { speciesId: '$organismId', speciesName: '$organismName' },
      },
      {
        $project: { organismId: 0, organismName: 0 },
      },
      {
        $out: 'genomefiles',
      },
    ],
    done
  );
};
