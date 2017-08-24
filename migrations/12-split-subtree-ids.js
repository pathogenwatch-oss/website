const mapLimit = require('promise-map-limit');

module.exports.id = '12-split-subtree-ids';

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;
  db.collection('collections')
    .find(
      { status: 'READY', 'subtrees.leafIds': { $exists: 1 } },
      { 'subtrees.name': 1, 'subtrees.tree': 1, 'subtrees.leafIds': 1 }
    )
    .toArray()
    .then(docs =>
      mapLimit(docs, 5, ({ _id, subtrees }) =>
        db.collection('collectiongenomes')
          .find({ _collection: _id }, { uuid: 1 })
          .toArray()
          .then(genomes => {
            const idSet = new Set(genomes.map(_ => _.uuid));
            return db.collection('collections').update(
              { _id },
              { $set: {
                subtrees: subtrees.map(({ name, tree, leafIds }) => {
                  const collectionIds = [];
                  const publicIds = [];
                  for (const id of leafIds) {
                    if (idSet.has(id)) {
                      collectionIds.push(id);
                    } else if (id !== name) {
                      publicIds.push(id);
                    }
                  }
                  return {
                    name,
                    tree,
                    collectionIds,
                    publicIds,
                    totalCollection: collectionIds.length,
                    totalPublic: publicIds.length,
                  };
                }),
              } }
            );
          })
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
