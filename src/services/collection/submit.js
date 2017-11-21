const Collection = require('models/collection');
const Analysis = require('models/analysis');

const { enqueue, queues } = require('../taskQueue');

const { getTreesTask } = require('../../manifest');

const { task, version, requires } = getTreesTask();

function enqueueTree(collectionId, organismId, clientId, subtree) {
  return enqueue(queues.trees, {
    collectionId,
    organismId,
    clientId,
    task,
    version,
    requires,
    subtree,
  });
}

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
  return Promise.all([
    enqueueTree(collectionId, organismId, clientId),
    getUniqueFps(collectionId)
      .then(fps => Promise.all(
        fps.map(subtree => enqueueTree(collectionId, organismId, clientId, subtree))
      )),
  ]);
};
