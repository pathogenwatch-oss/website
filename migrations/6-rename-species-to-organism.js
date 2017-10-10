module.exports.id = '6-rename-species-to-organism';

module.exports.up = function (done) {
  return done();
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collections()
    .then(collections => (
      new Set(collections).has('species') ?
        db.collection('species').rename('organisms') :
        Promise.resolve()
    ))
    .then(() => done())
    .catch(done);
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collections()
    .then(collections => (
      new Set(collections).has('organisms') ?
        db.collection('organisms').rename('species') :
        Promise.resolve()
    ))
    .then(() => done())
    .catch(done);
};
