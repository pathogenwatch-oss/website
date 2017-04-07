const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');

const { NotFoundError } = require('utils/errors');

function addPublicGenomes(_id, name, { tree, leafIds }) {
  return (
    CollectionGenome.find({
      _collection: { $ne: _id },
      uuid: { $in: leafIds, $ne: name },
    }).
    then(genomes => ({ tree, genomes }))
  );
}

module.exports = ({ uuid, name }) =>
  Collection.
    find({ uuid, 'subtrees.name': name }, { 'subtrees.$': 1 }).
    then(result => {
      if (!result.length) throw new NotFoundError('Not found');
      return result[0];
    }).
    then(({ _id, subtrees: [ subtree ] }) =>
      addPublicGenomes(_id, name, subtree));
