const { request } = require('services/bus');

const Collection = require('models/collection');

module.exports = function ({ collectionId, task, version, result, clientId }) {
  return (
    Collection.addAnalysisResult(collectionId, task, version, result)
      .then(() => {
        request('collection', 'send-progress', { clientId });
      })
      .then(() => {
        if (task !== 'tree') return null;
        return request('tasks', 'enqueue-subtrees', { collectionId, clientId });
      })
  );
};
