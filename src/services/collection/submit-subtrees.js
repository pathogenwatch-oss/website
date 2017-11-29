const Collection = require('models/collection');
const Genome = require('models/genome');

const { enqueue, queues } = require('../taskQueue');

const { getCollectionTask } = require('../../manifest');

function getUniqueFps(collectionId) {
  return Collection.findOne(
    { _id: collectionId },
    { genomes: 1 }
  )
    .lean()
    .then(({ genomes }) =>
      Genome.find(
        { _id: { $in: genomes }, 'analysis.core.fp.reference': { $exists: true } },
        { 'analysis.core.fp.reference': 1 }
      ).lean()
    )
    .then(genomes => {
      const fps = new Set();
      for (const { analysis } of genomes) {
        fps.add(analysis.core.fp.reference);
      }
      return Array.from(fps);
    });
}

module.exports = function ({ organismId, collectionId, clientId }) {
  const { task, version, requires } = getCollectionTask(organismId, 'subtree');
  return getUniqueFps(collectionId)
    .then(fps => Promise.all(
      fps.map(subtree =>
        enqueue(queues.collection, {
          collectionId,
          clientId,
          task,
          version,
          requires,
          metadata: {
            organismId,
            subtree,
          },
        })
      )
    ));
};
