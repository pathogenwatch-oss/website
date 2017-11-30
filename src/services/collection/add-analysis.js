const { request } = require('services/bus');

const Collection = require('../../models/collection');

module.exports = function ({ spec, metadata, result }) {
  const { task, version } = spec;
  const { collectionId, clientId } = metadata;
  return (
    Collection.addAnalysisResult(collectionId, task, version, result)
      .then(() => {
        request('collection', 'send-progress', { clientId, payload: { task, name: metadata.name, result } });
        if (task === 'tree') {
          const { organismId } = metadata;
          return request('collection', 'submit-subtrees', { collectionId, organismId, clientId });
        }
        return null;
      })
  );
};
