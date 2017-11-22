const Collection = require('models/collection');
const Analysis = require('models/analysis');

const { enqueue, queues } = require('../taskQueue');

const { getCollectionTask } = require('../../manifest');

function getUniqueFps(collectionId) {
  return Collection.findOne(
    { _id: collectionId },
    { 'genomes.fileId': 1, 'analysis.core': 1 }
  )
    .lean()
    .then(({ analysis, genomes }) =>
      Analysis.getResults(genomes.map(_ => _.fileId), 'core', analysis.core, { 'results.fp.subTypeAssignment': 1 })
    )
    .then(analyses => {
      const fps = new Set();
      for (const { results } of analyses) {
        fps.add(results.fp.subTypeAssignment);
      }
      return Array.from(fps);
    });
}

module.exports = function ({ organismId, collectionId, clientId }) {
  const { task, version, requires } = getCollectionTask(organismId, 'subtree');
  return getUniqueFps(collectionId)
    .then(fps => Promise.all(
      fps.map(subtree =>
        enqueue(queues.collections, {
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
