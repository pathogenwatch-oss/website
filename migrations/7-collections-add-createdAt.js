module.exports.id = '7-collections-add-createdAt';

module.exports.up = function (done) {
  return done();
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collection('collections').aggregate(
    [
      { $match: { createdAt: { $exists: false } } },
      { $addFields: { createdAt: '$progress.started' } },
      { $out: 'collections' },
    ],
    done
  );
};
