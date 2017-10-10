module.exports.id = require('./utils/getMigrationId.js')(__filename);

const updateDocs = require('./utils/updateDocs.js');

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;

  updateDocs(
    db.collection('collections').find({}, { _id: 1 }),
    ({ _id }) =>
      db.collection('collectiongenomes').aggregate([
        { $match: { _collection: _id, 'position.latitude': { $exists: true }, 'position.longitude': { $exists: true } } },
        { $project: { position: 1 } },
        { $group: { _id: { lat: '$position.latitude', lon: '$position.longitude' } } },
        { $project: { position: '$_id' } },
      ])
      .toArray()
      .then(docs =>
      db.collection('collections')
        .update(
          { _id },
          { $set: { locations: docs.map(({ position }) => ([ position.lat, position.lon ])) } }
        )
      )
  )
  .then(() => done())
  .catch(done);
};

module.exports.down = function (done) {
  const { db } = this;

  db.collection('collections').update({}, { $unset: { locations: 1 } }, { multi: true })
    .then(() => done())
    .catch(done);
};
