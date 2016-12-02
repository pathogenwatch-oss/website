const messageQueueService = require('services/messageQueue');

const { register, request } = require('./bus');

const COLLECTION_OPERATIONS = {
  CREATE: 'CREATE',
};

const LOGGER = require('utils/logging').createLogger('backend service');

function mapAssemblyIdsToFiles(uuids, files) {
  const unusedIds = new Set(uuids);
  return files.map(file => {
    const idPair = uuids.find(pair =>
      unusedIds.has(pair) && pair.checksum === file.id
    );
    unusedIds.delete(idPair);
    return {
      uuid: idPair.uuid,
      file,
    };
  });
}

const role = 'backend';

register(role, 'new-collection', ({ files }) => {
  const message = {
    checksums: files.map(_ => _.id),
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
          assemblies: mapAssemblyIdsToFiles(assemblyIds, files),
        });
      });

      messageQueueService.getCollectionIdExchange()
        .publish('manage-collection', message, { replyTo: queue.name });
    });
  });
});

register(role, 'submit', ({ files, collectionId, speciesId }) => {
  for (const file of files) {
    LOGGER.info(`Submitting assembly ${file.uuid}`);

    messageQueueService.getTaskExchange().publish(`${speciesId}.all`, {
      speciesId,
      collectionId,
      assemblyId: { uuid: file.uuid, checksum: file.id },
      sequenceFile: file.path,
      taskId: `${collectionId}_${file.uuid}`,
      action: 'CREATE',
    });
  }
});
