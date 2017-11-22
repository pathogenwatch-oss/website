const { request } = require('services/bus');

const Collection = require('../../models/collection');

module.exports = function ({ collectionId, task, version, result, metadata, clientId }) {
  return (
    Collection.addAnalysisResult(collectionId, task, version, result)
      .then(() => {
        request('collection', 'send-progress', { clientId });
      })
      .then(() => {
        if (task !== 'tree') return null;
        const { organismId } = metadata;
        return request('collection', 'submit-subtrees', { collectionId, organismId, clientId });
      })
  );
};
