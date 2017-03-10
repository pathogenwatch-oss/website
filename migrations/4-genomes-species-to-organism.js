module.exports.id = '4-genomes-species-to-organism';

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collection('genomes').aggregate(
    [
      {
        $addFields: { organismId: '$speciesId' },
      },
      {
        $project: { speciesId: 0 },
      },
      {
        $out: 'genomes',
      },
    ],
    done
  );
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collection('genomes').aggregate(
    [
      {
        $addFields: { speciesId: '$organismId' },
      },
      {
        $project: { organismId: 0 },
      },
      {
        $out: 'genomes',
      },
    ],
    done
  );
};
