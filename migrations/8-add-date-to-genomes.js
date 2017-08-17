module.exports.id = require('./utils/getMigrationId.js')(__filename);

const updateDocs = require('./utils/updateDocs.js');

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;

  updateDocs(
    db.collection('genomes').find(
      { year: { $exists: true, $ne: null }, date: { $exists: false } },
      { _id: 1, year: 1, month: 1, day: 1 }
    ),
    ({ _id, year, month, day }) =>
      db.collection('genomes').update(
        { _id },
        { $set: { date: new Date(year, (month || 1) - 1, day || 1) } }
      )
  )
  .then(() => done())
  .catch(done);
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collection('genomes')
    .update({ date: { $exists: true } }, { $unset: { date: true } })
    .then(() => done())
    .catch(done);
};
