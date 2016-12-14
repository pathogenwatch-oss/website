const messageQueueService = require('services/messageQueue');

const COLLECTION_OPERATIONS = {
  CREATE: 'CREATE',
};

function mapUuidsToGenomes(uuids, genomes) {
  const unusedIds = new Set(uuids);
  return genomes.map(genome => {
    const idPair = uuids.find(pair =>
      unusedIds.has(pair) && pair.checksum === genome._file.fileId
    );
    unusedIds.delete(idPair);
    return {
      uuid: idPair.uuid,
      genome,
    };
  });
}

module.exports = LOGGER => ({ genomes }) => {
  const message = {
    checksums: genomes.map(_ => _._file.fileId),
    collectionOperation: COLLECTION_OPERATIONS.CREATE,
  };
  LOGGER.debug(message);

  return new Promise((resolve, reject) => {
    messageQueueService.newCollectionAddQueue(queue => {
      queue.subscribe((error, response) => {
        if (error) {
          LOGGER.error(error);
          return reject(error);
        }
        LOGGER.info('Received response', response);
        queue.destroy();

        const { collectionId, assemblyIds, status } = response;
        if (!collectionId || !assemblyIds || status !== 'SUCCESS') {
          LOGGER.error('Invalid result of manageCollection');
          return reject();
        }

        resolve({
          collectionId,
          collectionGenomes: mapUuidsToGenomes(assemblyIds, genomes),
        });
      });

      messageQueueService.getCollectionIdExchange()
        .publish('manage-collection', message, { replyTo: queue.name });
    });
  });
};
