const Collection = require('models/collection');
const CollectionGenome = require('models/collectionGenome');

const { NotFoundError } = require('utils/errors');

function addPublicGenomes({ tree, publicIds }) {
  return (
    CollectionGenome
      .find({ uuid: { $in: publicIds } })
      .then(genomes => ({ tree, genomes }))
  );
}

module.exports = ({ uuid, name }) =>
  Collection
    .find({ uuid, 'subtrees.name': name }, { 'subtrees.$': 1 })
    .then(result => {
      if (!result.length) throw new NotFoundError('Not found');
      return result[0];
    })
    .then(({ subtrees: [ subtree ] }) => addPublicGenomes(subtree));
