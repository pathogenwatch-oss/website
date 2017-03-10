module.exports.id = '1-add-binned-flag-to-collections';

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const context = this;
  context.db.collection('collections').update(
    { binned: { $exists: false } },
    { $set: { binned: false } },
    { multi: true },
    done
  );
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const context = this;
  context.db.collection('collections').update(
    { binned: { $exists: true } },
    { $unset: { binned: '' } },
    { multi: true },
    done
  );
};
