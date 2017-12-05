module.exports.id = require('./utils/getMigrationId.js')(__filename);

const updateDocs = require('./utils/updateDocs.js');

function formatTree(tree, taxId) {
  if (tree) {
    const regexp = new RegExp(`^${taxId}_`, 'g');
    return tree.replace(regexp, '');
  }

  return tree;
}

function formatReferences(references, taxId) {
  const regexp = new RegExp(`^${taxId}_`, 'g');
  for (const reference of references) {
    reference.uuid = reference.uuid.replace(regexp, '');
  }
  return references;
}

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const { db } = this;

  updateDocs(
    db.collection('organisms').find(),
    ({ _id, taxId, tree, references }) =>
      db.collection('organisms').update(
        { _id },
        {
          $set: {
            tree: formatTree(tree, taxId),
            references: formatReferences(references, taxId),
          },
        }
      )
  )
  .then(() => done())
  .catch(done);
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  done();
};
