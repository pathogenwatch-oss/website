function createCollectionListDocument(couchbase, { assemblyIdentifiers }, collectionId) {
  const documentKey = `CL_${collectionId}`;
  return couchbase.store(documentKey, {
    type: 'CL',
    documentKey,
    assemblyIdentifiers,
  });
}

function cleanDatabase(couchbase, collectionId) {
  return Promise.all([
    couchbase.remove(`CTR_${collectionId}`),
    couchbase.remove(`LOCK_CTR_SIM_${collectionId}`),
    couchbase.remove(`LOCK_GS_${collectionId}`),
    couchbase.remove(`LOCK_${collectionId}_SUBTREES_`),
    couchbase.remove(`LOCK_SIM_MAT_${collectionId}`),
  ])
  .catch(() => {});
}

module.exports = function ({ oldId, newId }) {
  const couchbase = require('services/storage')('main');

  const oldDocumentKey = `CL_${oldId}`;
  return (
    couchbase.retrieve(oldDocumentKey)
      .then(doc => createCollectionListDocument(couchbase, doc, newId))
      .then(() => couchbase.remove(oldDocumentKey))
      .then(() => cleanDatabase(couchbase, newId))
  );
};
