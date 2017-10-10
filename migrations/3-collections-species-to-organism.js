module.exports.id = '3-collections-species-to-organism';

module.exports.up = function (done) {
  return done();
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collection('collections').aggregate(
    [
      {
        $addFields: { organismId: '$speciesId', _organism: '$_species' },
      },
      {
        $project: { speciesId: 0, _species: 0 },
      },
      {
        $out: 'collections',
      },
    ],
    done
  );
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collection('collections').aggregate(
    [
      {
        $addFields: { speciesId: '$organismId', _species: '$_organism' },
      },
      {
        $project: { organismId: 0, _organism: 0 },
      },
      {
        $out: 'collections',
      },
    ],
    done
  );
};
