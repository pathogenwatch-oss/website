const { request } = require('services');
const Collection = require('../../models/collection');

module.exports = function ({ spec, metadata }) {
  const { task, version } = spec;
  const { collectionId, clientId } = metadata;
  return Collection.findById(collectionId)
    .then(collection => {
      const tree = task === 'tree' ?
        collection.tree :
        collection.subtrees.find(t => t.name === metadata.name);
      tree.status = 'FAILED';
      return collection.save();
    })
    .then(() => {
      const payload = { task, status: 'FAILED', timestamp: Date.now() };
      return request('collection', 'send-progress', { clientId, payload });
    });
};
