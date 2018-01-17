const Genome = require('models/genome');

const { request } = require('services');

const projection = {
  _user: 1,
  _organism: 1,
  createdAt: 1,
  description: 1,
  genomes: 1,
  organismId: 1,
  pmid: 1,
  size: 1,
  tree: 1,
  'subtrees.name': 1,
  'subtrees.size': 1,
  'subtrees.populationSize': 1,
  'subtrees.status': 1,
  'subtrees.task': 1,
  'subtrees.version': 1,
  title: 1,
  uuid: 1,
};

module.exports = ({ user, id }) =>
  request('collection', 'authorise', { user, id, projection })
    .then(collection =>
      collection
        .populate('_organism', {
          tree: 1,
          resistance: 1,
          'references.name': 1,
          'references.uuid': 1,
        })
        .execPopulate()
        .then(() => Genome.getForCollection({ _id: { $in: collection.genomes } }))
        .then(genomes => {
          const doc = collection.toObject();
          doc.genomes = genomes;
          doc.status = 'READY';
          doc.subtrees = doc.subtrees || [];
          return doc;
        })
    );
