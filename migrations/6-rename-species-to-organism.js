module.exports.id = '5-rename-species-to-organism';

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collection('species').rename(
    'organisms',
    true,
    done
  );
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collection('organisms').rename(
    'species',
    true,
    done
  );
};
