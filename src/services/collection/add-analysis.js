const { request } = require('services/bus');

const Collection = require('models/collection');

module.exports = function ({ collectionId, task, version, result, clientId }) {
  return (
    Collection.addAnalysisResult(collectionId, task, version, result)
      .then(() => {
        request('collection', 'send-progress', { clientId });
      })
  );
};
