module.exports.id = '5-genomefiles-species-to-organism';

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collection('genomefiles').aggregate(
    [
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
