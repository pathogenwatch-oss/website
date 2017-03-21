const Collection = require('models/collection');
const { request } = require('services');

function createGenome(metadata, getGenomeFile, reference) {
  const stream = getGenomeFile(metadata);
  return (
    request('genome', 'create', { stream, metadata, reference }).
      then(({ id }) =>
        request('genome', 'edit', { id, metadata }).
          then(() => request('genome', 'fetch-one', { id }))
      )
  );
}

module.exports = function (collectionProps, genomes, getGenomeFile) {
  const { organismId, title, description, reference = false } = collectionProps;
  return genomes.reduce((memo, row) =>
    memo.then(_ =>
      createGenome(row, getGenomeFile, reference)
        .then(genome => _.concat(genome))
    ),
    Promise.resolve([])
  )
  .then(collectionGenomes =>
    Collection.create({
      size: collectionGenomes.length,
      organismId,
      title,
      description,
      reference,
    }).
    then(collection =>
      Promise.all([
        collection.addUUID(collectionProps.collectionId),
        request('collection', 'add-genomes', { collection, collectionGenomes }),
      ])
    )
  );
};
