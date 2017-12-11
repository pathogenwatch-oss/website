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

module.exports = function ({ spec, metadata, result }) {
  const { task, version } = spec;
  const { collectionId, clientId } = metadata;
  return (
    Collection.addAnalysisResult(collectionId, task, version, result)
      .then(() => {
        const payload = getNotificationPayload(task, result);
        request('collection', 'send-progress', { clientId, payload });
        if (task === 'tree') {
          return request('collection', 'submit-subtrees', metadata);
        }
        return null;
      })
  );
};
