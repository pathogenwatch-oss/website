const { request } = require('services');
const Genome = require('models/genome');

const { NotFoundError } = require('utils/errors');

module.exports = ({ user, uuid, name }) => {
  const query = { 'subtrees.name': name };
  const projection = { 'subtrees.$': 1 };
  return request('collection', 'authorise', { user, uuid, query, projection })
    .then(collection => {
      if (!collection || collection.subtrees.length === 0) throw new NotFoundError('Not found');
      return collection.subtrees[0];
    })
    .then(({ populationIds, newick }) =>
      Genome.getCollection(populationIds).then(genomes => ({ newick, genomes }))
    );
};
