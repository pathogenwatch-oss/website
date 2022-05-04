const { request } = require('services/bus');

const Collection = require('../../models/collection');

function getNotificationPayload(task, result) {
  if (task === 'subtree') {
    return {
      task,
      name: result.name,
      status: 'READY',
      size: result.size,
      populationSize: result.populationSize,
    };
  }

  return {
    task,
    name: result.name,
    status: 'READY',
  };
}

module.exports = function ({ spec, metadata, result, precache = false }) {
  const { task } = spec;
  const { collectionId, clientId } = metadata;
  if (!precache) {
    return (
      Collection.addAnalysisResult(collectionId, task, result)
        .then(() => {
          const payload = getNotificationPayload(task, result);
          request('collection', 'send-progress', { clientId, payload });
          return null;
        })
    );
  }
  return null;
};
