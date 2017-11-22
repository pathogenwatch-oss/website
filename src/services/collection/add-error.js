const { request } = require('services');
const Collection = require('../../models/collection');

module.exports = function ({ collectionId, task, version, clientId }) {
  return Collection.findById(collectionId)
    .then(collection => {
      collection.progress.errors.push({ task, version, date: new Date() });
      return collection.failed(`Received error for task: ${task}`);
    })
    .then(() => request('collection', 'send-progress', { collectionId, clientId }));
};
