module.exports.id = '8-date-to-genomes';

function convertToDate({ year, month, day }) {
  return new Date(year, (month || 1) - 1, day || 1);
}

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collection('genomes')
    .find({ year: { $exists: true, $ne: null }, date: { $exists: false } })
    .toArray()
    .then(docs =>
      Promise.all(docs.map(doc =>
        db.collection('genomes')
          .update({ _id: doc._id }, { $set: { date: convertToDate(doc) } })
      ))
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
