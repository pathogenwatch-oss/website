const { request } = require('services/bus');

const Collection = require('../../models/collection');

module.exports = function ({ spec, metadata, result }) {
  const { task, version } = spec;
  const { collectionId, clientId, name } = metadata;
  return (
    Collection.addAnalysisResult(collectionId, task, version, result)
      .then(() => {
        const payload = { task, name, status: 'READY' };
        request('collection', 'send-progress', { clientId, payload });
        if (task === 'tree') {
          return request('collection', 'submit-subtrees', metadata);
        }
        return null;
      })
  );
};
