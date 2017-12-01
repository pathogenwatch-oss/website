const { request } = require('services');
const Genome = require('models/genome');

const { NotFoundError } = require('utils/errors');

const isLeafId = /[0-9a-f]{24}/g;

function getLeafIds(newick) {
  return newick.match(isLeafId) || [];
}

module.exports = ({ user, uuid, name }) => {
  const query = { 'subtrees.name': name };
  const projection = { 'subtrees.$.newick': 1, genomes: 1 };
  return request('collection', 'authorise', { user, uuid, query, projection })
    .then(collection => {
      if (!collection || collection.subtrees.length === 0) throw new NotFoundError('Not found');
      const { genomes, subtrees } = collection;
      const { newick } = subtrees[0];
      const leafIds = getLeafIds(newick);
      return Genome.getForCollection(
        { _id: { $in: leafIds, $nin: genomes }, public: true, 'analysis.core.fp.reference': name }
      )
      .then(docs => ({ newick, genomes: docs }));
    });
};
