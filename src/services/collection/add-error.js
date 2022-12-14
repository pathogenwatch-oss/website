const { request } = require('services');
const Collection = require('../../models/collection');

module.exports = async function ({ spec, metadata }) {
  const { task } = spec;
  const { collectionId, clientId, name } = metadata;

  if (task === 'tree') {
    await Collection.update({ _id: collectionId }, { 'tree.status': 'FAILED' });
  } else {
    await Collection.update(
      { _id: collectionId, 'subtrees.name': name },
      { 'subtrees.$.status': 'FAILED' }
    );
  }

  const payload = { task, name, status: 'FAILED' };
  return request('collection', 'send-progress', { clientId, payload });
};
